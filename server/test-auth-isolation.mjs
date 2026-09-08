// server/test-auth-isolation.mjs
// Automated verification script for RigForge multi-user session isolation and IDOR protection.

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting RigForge Multi-User Session Isolation & IDOR Test Suite...\n');
  let testsPassed = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // 0. Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.ok && healthData.status === 'ONLINE', 'Backend API is ONLINE');

    // Generate unique emails for test run
    const rand = Math.floor(Math.random() * 10000);
    const userA = {
      name: 'User Alpha',
      email: `usera_${rand}@testrigforge.in`,
      password: 'StrongPassword123!',
    };
    const userB = {
      name: 'User Beta',
      email: `userb_${rand}@testrigforge.in`,
      password: 'SecurePassword456!',
    };

    // 1. Register User A -> Should succeed and redirect to login (NO auto-login / NO token)
    console.log('\n--- Step 1: User A Registration ---');
    const regResA = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });
    const regDataA = await regResA.json();
    assert(regResA.status === 201 && regDataA.success === true, 'User A registered successfully');
    assert(!regDataA.token, 'User A registration does NOT issue an automatic session token (forces redirect to login)');

    // 2. Duplicate registration check
    console.log('\n--- Step 2: Duplicate Email Registration Prevention ---');
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });
    const dupData = await dupRes.json();
    assert((dupRes.status === 400 || dupRes.status === 409) && dupData.success === false, 'Duplicate email registration correctly rejected');

    // 3. User A Bad Password Login Check
    console.log('\n--- Step 3: Invalid Password Rejection ---');
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: 'WrongPassword999' }),
    });
    assert(badLoginRes.status === 401, 'Login with incorrect password returns 401 Unauthorized');

    // 4. User A Valid Login -> Gets Token A
    console.log('\n--- Step 4: User A Valid Login ---');
    const loginResA = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: userA.password }),
    });
    const loginDataA = await loginResA.json();
    assert(loginResA.status === 200 && !!loginDataA.token, 'User A logged in and received Token A');
    assert(loginDataA.user.email === userA.email, 'Token A identity matches User A email');
    const tokenA = loginDataA.token;

    // 5. User A Creates Order -> Docket A
    console.log('\n--- Step 5: User A Order Placement ---');
    const orderPayloadA = {
      items: [
        { id: 'cpu-1', name: 'Intel Core i5-13600K', price: 29500, quantity: 1, category: 'cpu' },
      ],
      subtotal: 29500,
      tax: 5310,
      shippingFee: 0,
      totalAmount: 34810,
      utrNumber: '112233445566',
    };
    const orderResA = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(orderPayloadA),
    });
    const orderDataA = await orderResA.json();
    const docketA = orderDataA.orderId || orderDataA.order?.orderId || orderDataA.tracking?.docketNumber;
    assert(orderResA.status === 201 && !!docketA, `User A placed order with Docket: ${docketA}`);

    // 6. Register User B -> Should succeed and redirect to login
    console.log('\n--- Step 6: User B Registration ---');
    const regResB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB),
    });
    const regDataB = await regResB.json();
    assert(regResB.status === 201 && regDataB.success === true, 'User B registered successfully');
    assert(!regDataB.token, 'User B registration does NOT issue automatic session token');

    // 7. User B Valid Login -> Gets Token B
    console.log('\n--- Step 7: User B Valid Login ---');
    const loginResB = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userB.email, password: userB.password }),
    });
    const loginDataB = await loginResB.json();
    assert(loginResB.status === 200 && !!loginDataB.token, 'User B logged in and received Token B');
    assert(loginDataB.user.email === userB.email, 'Token B identity matches User B email');
    assert(loginDataB.token !== tokenA, 'Token B is completely distinct from Token A');
    const tokenB = loginDataB.token;

    // 8. User B Creates Order -> Docket B
    console.log('\n--- Step 8: User B Order Placement ---');
    const orderPayloadB = {
      items: [
        { id: 'gpu-1', name: 'NVIDIA GeForce RTX 4070 Super', price: 61999, quantity: 1, category: 'gpu' },
      ],
      subtotal: 61999,
      tax: 11159,
      shippingFee: 0,
      totalAmount: 73158,
      utrNumber: '998877665544',
    };
    const orderResB = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify(orderPayloadB),
    });
    const orderDataB = await orderResB.json();
    const docketB = orderDataB.orderId || orderDataB.order?.orderId || orderDataB.tracking?.docketNumber;
    assert(orderResB.status === 201 && !!docketB, `User B placed order with Docket: ${docketB}`);

    // 9. Verify Order Isolation: GET /api/orders with Token A
    console.log('\n--- Step 9: Order Isolation Check (User A Query) ---');
    const listResA = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const listDataA = await listResA.json();
    assert(listResA.status === 200, 'User A successfully queried /api/orders');
    const orderIdsA = listDataA.orders.map((o) => o.orderId);
    assert(orderIdsA.includes(docketA), 'User A order list contains User A docket');
    assert(!orderIdsA.includes(docketB), 'User A order list DOES NOT contain User B docket (Cross-session leakage prevented)');

    // 10. Verify Order Isolation: GET /api/orders with Token B
    console.log('\n--- Step 10: Order Isolation Check (User B Query) ---');
    const listResB = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const listDataB = await listResB.json();
    assert(listResB.status === 200, 'User B successfully queried /api/orders');
    const orderIdsB = listDataB.orders.map((o) => o.orderId);
    assert(orderIdsB.includes(docketB), 'User B order list contains User B docket');
    assert(!orderIdsB.includes(docketA), 'User B order list DOES NOT contain User A docket (Cross-session leakage prevented)');

    // 11. IDOR Prevention: User A attempts to fetch User B's docket directly
    console.log('\n--- Step 11: Direct IDOR Exploit Prevention ---');
    const idorRes = await fetch(`${BASE_URL}/api/orders/${docketB}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(idorRes.status === 403, 'User A attempting to access User B docket returned HTTP 403 Forbidden');

    // 12. Unauthenticated access check
    console.log('\n--- Step 12: Unauthenticated Access Prevention ---');
    const unauthRes = await fetch(`${BASE_URL}/api/orders`);
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/orders returned HTTP 401 Unauthorized');

    console.log('\n========================================');
    console.log(`📊 Test Summary: ${testsPassed}/${totalTests} Tests Passed`);
    console.log('========================================');

    if (testsPassed === totalTests) {
      console.log('🎉 ALL MULTI-USER ISOLATION & IDOR TESTS PASSED!\n');
    } else {
      console.error('⚠️ Some tests failed!\n');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('💥 Test execution error:', err);
    process.exitCode = 1;
  }
}

runTests();
