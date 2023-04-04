### Refactoring
1. Principles of designing SOLID code
2. How not to write code

Develop awareness so that code smells don't cripple the system. Good design and software
is the result of constant improvement of the code base.

### Fundamentals of Good Software Design
#### Information hiding
We should hide parts of the code that are likely to change behind stable interfaces for modules.
Other modules should only depend on public facing interfaces. Hidden implementation details can then be changed
without affecting other modules.

#### Encapsulation
Refers to not giving access to internal data but give public methods for other modules to call that
then would change state.

#### Abstraction
Other modules should only see the important parts of functionality of classes.
We should not expose how we carry out the functionality. We try to find which abstractions
can be decomposed from the product to achieve the functionality.

![image](https://user-images.githubusercontent.com/27693622/229740102-1592015a-4110-4c04-baa8-4c3dc2704a86.png)

As shown above, a Product can be broken down into the abstractions Measurable and Sellable. The Product is measurable with
length width and depth. Products have prices so the Sellable abstraction is relevant for the Product.

#### Polymorphism
Classes can share a stable interface and have different functionality as they implement the interface. Code that works with
Sellable could include Products such as Warranty or other services we might want to sell.

#### Deep modules
Modules that have a lot of functionality which are exposed via a simple interface are called Deep modules.
These modules are easier to maintain and add more functionality.

![image](https://user-images.githubusercontent.com/27693622/229743263-77ff51bb-5d8e-4d8c-b83a-9477ae722626.png)

Simpler interfaces mean that we give users of our interface less to learn and less opportunity for the interface to break
client code.

### SOLID

#### Single Responsibility Principle
Entities should have one reason to change and encode one part of domain knowledge. Breaking this principle can
lead to high coupling.

![image](https://user-images.githubusercontent.com/27693622/229745702-6f896484-f69d-48b2-875c-ae51c9cfa95a.png)

Here the Order Manager groups Inventory Management, Shipment Management and Invoice Management in the same class.
This has led to direct dependencies and coupling between the classes. This means that changes in one part of the code
affect other parts of the code and there is tight coupling. We are working with implementation details.
In order to resolve this we can split the managers and expose clear interfaces for each class. The invoice manager
cannot call the Inventory manager directly and instead call clearly defined interfaces. Expose responsibilities via a simple
interface.

#### Open Closed Principle
Entities should be open for extension but closed for modification. 

![image](https://user-images.githubusercontent.com/27693622/229747988-29e3c033-7bb8-41c4-9ae3-5f8a06ede99e.png)

Rather than changing interfaces we should create new implementations of the interface to add different functionality
using polymorphism.

#### Liskov Substitution Principle

Subclasses should not implement any behaviour that contradicts or restricts the intended 
behaviour of their superclasses.

![image](https://user-images.githubusercontent.com/27693622/229750423-4b60c33d-439a-45ed-8536-34ca8ca62ae8.png)

As opposed to using a walk() function for the interface which would require the Bird class to throw an exception
we should use a better abstraction (move()) which allows subclasses to fulfil the functionality in their own way
without contradicting or restricting the interface function.

#### Interface Segregation Principle
No code should depend on methods it doesn't use. Classes that depend on interfaces should not implement
empty functions. When this starts happening it signals that we are incorrectly defining our interfaces.
If we are using an interface with empty methods other people using the module will find it difficult to
understand why we are not providing functionality for some of the declared methods.

#### Dependency Inversion Principle
High level modules should not depend on lower level modules both should depend on abstractions.

![image](https://user-images.githubusercontent.com/27693622/229765399-1b4489f8-b07d-4f74-a7ff-89b26da7ba9a.png)

We add a layer of decoupling between higher level modules and lower level modules we can swap out the FileStore and HttpStore
without affecting the DataDisplay code. The DataDisplay does not depend on the implementation details of the
possible DataStore.

### Code Smells

#### Repeated Switch statements
Switch statements are not inherently bad but if we have the repeated switch statement happening this causes multiple 
places to change code when the logic changes.

```typescript
class Calculator {
  private _operations: { operation: string; oldValue: number; value: number }[] = [];
  private _currentValue: number;

  constructor(initialValue: number) {
    this._currentValue = initialValue;
  }

  execute(operation: string, newValue: number) {
    switch (operation) {
      case "add":
        this._operations.push({ operation: "add", oldValue: this._currentValue, value: newValue });
        this._currentValue = this._currentValue + newValue;
        return this;
      case "subtract":
        this._operations.push({
          operation: "subtract",
          oldValue: this._currentValue,
          value: newValue,
        });
        this._currentValue = this._currentValue - newValue;
        return this;
      case "multiply":
        this._operations.push({
          operation: "multiply",
          oldValue: this._currentValue,
          value: newValue,
        });
        this._currentValue = this._currentValue * newValue;
        return this;
      case "divide":
        this._operations.push({
          operation: "divide",
          oldValue: this._currentValue,
          value: newValue,
        });
        this._currentValue = this._currentValue / newValue;
        return this;
      default:
        throw new Error("Unsupported operation");
    }
  }

  printOperations() {
    for (const operationObj of this._operations) {
      switch (operationObj.operation) {
        case "add":
          console.log(`${operationObj.oldValue} plus ${operationObj.value}`);
          break;
        case "subtract":
          console.log(`${operationObj.oldValue} minus ${operationObj.value}`);
          break;
        case "multiply":
          console.log(`${operationObj.oldValue} multiplied by ${operationObj.value}`);
          break;
        case "divide":
          console.log(`${operationObj.oldValue} divided by ${operationObj.value}`);
          break;
      }
    }
    console.log("-----------");
    console.log(`Total: ${this._currentValue}`);
  }
}

const calculator = new Calculator(0);

calculator
  .execute("add", 10)
  .execute("add", 20)
  .execute("subtract", 15)
  .execute("multiply", 3)
  .execute("divide", 2)
  .printOperations();

export {};
```

The expected behaviour is as follows:
```bash
 npm start -- repeated-switches

> code-smells@1.0.0 start
> node scripts/run.js repeated-switches


> code-smells@1.0.0 exec
> ts-node ./src/repeated-switches/index.ts

0 plus 10
10 plus 20
30 minus 15
15 multiplied by 3
45 divided by 2
-----------
Total: 22.5

```
To add another operation we would have to add the operation to both switch statements.
How to fix?
- encapsulate conditional logic
- use polymorphism to remove conditional statements

We refactor the switch statements by using an interface with different Operation implementations:

```typescript
class Calculator {
    private _operations: Operation[] = [];
    private _currentValue: number;

    constructor(initialValue: number) {
        this._currentValue = initialValue;
    }

    private createOperation(operation: String, newValue: number) {
        switch (operation) {
            case "add":
                return new Add(this._currentValue, newValue);
            case "subtract":
                return new Subtract(this._currentValue, newValue);
            case "multiply":
                return new Multiply(this._currentValue, newValue);
            case "divide":
                return new Divide(this._currentValue, newValue);
            default:
                throw new Error("Unsupported operation");
        }
    }

    add(newValue: number) {
        return this.execOperation("add", newValue);
    }

    subtract(newValue: number) {
        return this.execOperation("subtract", newValue);
    }

    multiplyBy(newValue: number) {
        return this.execOperation("multiply", newValue);
    }

    divideBy(newValue: number) {
        return this.execOperation("divide", newValue);
    }

    private execOperation(operation: 'add' | 'subtract' | 'multiply' | 'divide', newValue: number) {
        const newOperation = this.createOperation(operation, newValue);
        this._operations.push(newOperation);
        this._currentValue = newOperation.operate();

        return this;
    }

    printOperations() {
        this._operations.forEach(operation => console.log(operation.toString()))
        console.log("-----------");
        console.log(`Total: ${this._currentValue}`);
    }
}

const calculator = new Calculator(0);

calculator
    .add(10)
    .add(20)
    .subtract(15)
    .multiplyBy(3)
    .divideBy(2)
    .printOperations();

export {};
```

We still get the same result:
```bash
> ts-node ./src/repeated-switches/index.ts

0 plus 10
10 plus 20
30 minus 15
15 multiplied by 3
45 divided by 2
-----------
Total: 22.5
```

This is the new design for the Calculator:
![image](https://user-images.githubusercontent.com/27693622/229783085-d7997766-a43e-4597-9ffa-3e3bbd754899.png)

We have now centralised the switch statement in the createOperation function. The factory function encapsulates everything
and the rest of the application depends on abstractions.

