# TDD Patterns

## Stub

```python
def test_calculates_total():
    pricing = Stub(prices=[10, 20, 30])
    assert calculate_total(pricing) == 60
```

## Mock

```python
def test_sends_notification():
    notifier = Mock()
    process_order(Order(id=1), notifier)
    notifier.send.assert_called_once_with("Order 1 processed")
```

## Fake

```python
class FakeClock:
    def now(self):
        return datetime(2024, 1, 1)

def test_subscription_expiry():
    clock = FakeClock()
    assert is_expired(subscription, clock) is False
```

## Triangulation

Add a second example to generalize:

```python
# First test
assert add(2, 3) == 5

# Second test (triangulates generalization)
assert add(0, 0) == 0
assert add(-1, 1) == 0
```

## Transformation Priority Premise

1. (uu) Unconditionally replace
2. (u) Replace with direct equivalent
3. (s) Split input/output
4. (i) Inline helper
5. (e) Extract embedded language
6. (c) Change function signature
7. (a) Add parameter
8. (t) Replace logic with algorithm

Prefer higher-priority transforms.

## Test structure by language

### Python (pytest)

```python
def test_something():
    result = function_under_test()
    assert result == expected
```

### JavaScript/TypeScript (jest)

```js
test('something', () => {
  const result = functionUnderTest();
  expect(result).toBe(expected);
});
```

### Go

```go
func TestSomething(t *testing.T) {
    result := FunctionUnderTest()
    if result != expected {
        t.Errorf("got %v, want %v", result, expected)
    }
}
```

## Arrange-Act-Assert (AAA)

```python
def test_calculates_total():
    # Arrange
    items = [Price(10), Price(20), Price(30)]
    calculator = OrderCalculator()

    # Act
    total = calculator.calculate(items)

    # Assert
    assert total == 60
```

```javascript
test('calculates total', () => {
  // Arrange
  const items = [10, 20, 30];
  const calculator = new OrderCalculator();

  // Act
  const total = calculator.calculate(items);

  // Assert
  expect(total).toBe(60);
});
```

## Given-When-Then (BDD)

```python
def test_order_processes_successfully():
    # Given
    order = Order(id=1, items=[Item('book', 29.99)])
    payment = PaymentMethod(credit_card='4111-1111-1111-1111')

    # When
    result = process_order(order, payment)

    # Then
    assert result.status == 'confirmed'
    assert result.confirmation_email_sent is True
```

```javascript
describe('Order processing', () => {
  it('should confirm order when payment succeeds', () => {
    // Given
    const order = { id: 1, items: [{ name: 'book', price: 29.99 }] };
    const payment = { type: 'credit_card', token: 'tok_visa' };

    // When
    const result = processOrder(order, payment);

    // Then
    expect(result.status).toBe('confirmed');
    expect(result.confirmationEmailSent).toBe(true);
  });
});
```

## Exception Testing

```python
def test_raises_on_invalid_input():
    with pytest.raises(ValueError, match="price must be positive"):
        create_order(price=-10)
```

```javascript
test('throws on invalid input', () => {
  expect(() => createOrder(-10)).toThrow('price must be positive');
});
```

## Parameterized Tests

```python
@pytest.mark.parametrize("a,b,expected", [
    (0, 0, 0),
    (1, 1, 2),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

```javascript
test.each([
    [0, 0, 0],
    [1, 1, 2],
    [-1, 1, 0],
    [100, 200, 300],
])('adds %i + %i = %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
});
```

## Kent Beck's rules

1. You are not allowed to write any production code unless it makes a failing test pass.
2. You are not allowed to write any more of a test than is sufficient to fail; and compilation failures are failures.
3. You are not allowed to write any more production code than is sufficient to pass the one failing test.