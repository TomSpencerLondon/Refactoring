### Refactoring
Refactoring: Improving the Design of Existing Code, Martin Fowler provides a good overview of
Code Smells and ways to refactor them.
This course is a good overview of the Code Smells:
https://www.udemy.com/course/write-better-code-20-code-smells-how-to-fix-them

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
and the rest of the application depends on abstractions. Now we don't use concrete instances. The only place we see concrete
instances is inside the factory function.

#### Primitive Obsession
Primitives spread through an application when we don't add types to deal with domain behaviour and logic.
When we use primitives we lose the advantages of hiding and encapsulation. The code smell can lead to duplication of knowledge
when we are dealing with validation. It is also easy to forget duplicated primitives when making behaviour changes.
To fix this code smell we should model domain behaviour and non-primitive knowledge in custom types.

```typescript

class Customer {
  private _id: string;
  private _name: string;
  private _address: string;
  private _phone: string;
  private _email: string;
  private readonly EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  private readonly PHONE_REGEX = /\d{2}\ \d{8}/;

  constructor(name: string, address: string, phone: string, email: string, id?: string) {
    this._id = id || uuidV4();
    this._name = name;
    this._address = address;
    this._phone = phone;
    this._email = email;
  }

  isEmailValid() {
    return this.EMAIL_REGEX.test(this._email);
  }

  isPhoneValid() {
    return this.PHONE_REGEX.test(this._phone);
  }

  getPhoneAreaCode() {
    return this._phone.split(" ")[0];
  }

  getPhoneNumber() {
    return this._phone.split(" ")[1];
  }
}

export {};

```
The above logic could be duplicated through several classes.
We can refactor the logic into separate Email and Phone classes with their own validation logic:

```typescript

type CustomerRawData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  id?: string
}

class Email {
  private _emailValue: string;
  private readonly EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(emailValue: string) {
    this._emailValue = emailValue;
  }

  isValid() {
    return this.EMAIL_REGEX.test(this._emailValue);
  }

}

class Phone {
  private _areaCode: string;
  private _phoneNumber: string;
  
  constructor(phoneValue: string) {
    const phoneComponents = phoneValue.split(" ");
    this._areaCode = phoneComponents[0];
    this._phoneNumber = phoneComponents[1];
  }

  isValid() {
    return this._areaCode.length == 2 && this._phoneNumber.length == 8;
  }

  getAreaCode() {
    return this._areaCode;
  }

  getNumber() {
    return this._phoneNumber;
  }
}

class Customer {
  private _id: string;
  private _name: string;
  private _address: string;
  private _phone: Phone;
  private _email: Email;

  constructor(customerData: CustomerRawData) {
    const {name, address, phone, email, id} = customerData;
    this._id = id || uuidV4();
    this._name = name;
    this._address = address;
    this._phone = new Phone(phone);
    this._email = new Email(email);
  }

  getEmail() {
    return this._email;
  }

  getPhone() {
    return this._phone;
  }
}

const myCustomer = new Customer({
  name: 'Tom',
  address: 'Street 123',
  phone: '12 34567890',
  email: 'tom@example.com'
})

console.log(myCustomer.getEmail().isValid());
console.log(myCustomer.getPhone().isValid());
console.log(myCustomer.getPhone().getAreaCode());

export {};

```

### Loops
Adding too many loops can quickly make it confusing to read and hard to maintain.
Hardcoding loops in code can break the rules of information hiding and encapsulation.
Too many loops can make code harder to maintain. Instead of hardcoding the loops we can use pipeline structures (.map, .filter, .reduce)
to abstract the iteration logic and focus on how the elements of the collection are being filtered.

```typescript
type CsvObject = {
  headers: string;
  lines: string[];
};

const convertRecordsToCsvObject = (records: Record<string, string | undefined>[]): CsvObject => {
  if (records.length === 0) {
    return {
      headers: "",
      lines: [],
    };
  }

  let headers = "";

  for (const key of Object.keys(records[0])) {
    headers += `${key},`;
  }

  headers = headers.slice(0, -1);

  const lines = [];

  for (const record of records) {
    let line = "";

    for (const value of Object.values(record)) {
      line += `${value},`;
    }

    line = line.slice(0, -1);
    lines.push(line);
  }

  return {
    headers,
    lines,
  };
};

console.log(
  convertRecordsToCsvObject([
    {
      name: "John",
      dateOfBirth: "1990-01-01",
      email: "john@example.com",
    },
    {
      name: "Jane",
      dateOfBirth: "1992-01-01",
      email: "jane@example.com",
    },
  ])
);

export {};

```
This outputs the following result:
```bash
{
  headers: 'name,dateOfBirth,email',
  lines: [
    'John,1990-01-01,john@example.com',
    'Jane,1992-01-01,jane@example.com'
  ]
}

```

The loops above force us to code implementation details in the functions that use them.
The more loops we have, the more cognitive load.

```typescript
type CsvObject = {
    headers: string;
    lines: string[];
};

const convertRecordsToCsvObject = (records: Record<string, string | undefined>[]): CsvObject => ({
    headers: Object.keys(records[0] || {}).join(",").slice(0, -1),
    lines: records.map(record => Object.values(record).join(",").slice(0, -1))
});

console.log(
    convertRecordsToCsvObject([
        {
            name: "John",
            dateOfBirth: "1990-01-01",
            email: "john@example.com",
        },
        {
            name: "Jane",
            dateOfBirth: "1992-01-01",
            email: "jane@example.com",
        },
    ])
);

console.log(convertRecordsToCsvObject([]))

export {};

```

The above join and map functions allow us to reduce the amount of code in the Record class and the code is cleaner, easier to
maintain and easier to read.

#### Long parameter list
Alongside the eponymous code smell, flag parameters are also considered bad because they are used soley to determine which path the method
must execute and make it harder to reason about the method's overall behaviour and intention.
We should substitute data parameters with a single data object parameter. We can also use another parameter to extract the information
of other parameters and we should also avoid using flag parameters.

This is the code pre-refactoring:
```typescript
interface Customer {
  getIdentifier(): string;
  getAddress(): string;
  hasPremiumSubscription(): boolean;
}

class Order {
  private _id: string;
  private _customerId: string;
  private _customerAddress: string;
  private _hasPriority: boolean;
  private _productIds: string[];

  constructor(
    id: string,
    customerId: string,
    customerAddress: string,
    productIds: string[],
    isPremiumCustomer: boolean
  ) {
    this._id = id;
    this._customerId = customerId;
    this._customerAddress = customerAddress;
    this._productIds = productIds;
    this._hasPriority = isPremiumCustomer;
  }

  getProductIds() {
    return this._productIds;
  }

  getCustomerId() {
    return this._customerId;
  }
}

export {};

```


This is the refactored version:

```typescript
interface ICustomer {
  getIdentifier(): string;

  getAddress(): string;

  hasPremiumSubscription(): boolean;
}

type OrderRawData = {
  id?: string,
  customer: ICustomer,
  productIds: string[]
}

interface IOrder {
  getProductIds(): string[];

  getCustomerId(): string;

  getDeliveryDays(): number;
}

class StandardOrder implements IOrder {
  private _id: string | undefined;
  private _customerId: string;
  private _customerAddress: string;
  private _hasPriority: boolean;
  private _productIds: string[];

  constructor(
    orderData: OrderRawData
  ) {
    const { id, customer, productIds } = orderData;
    this._id = id;
    this._customerId = customer.getIdentifier();
    this._customerAddress = customer.getAddress();
    this._productIds = productIds;
    this._hasPriority = customer.hasPremiumSubscription();
  }

  getProductIds() {
    return this._productIds;
  }

  getCustomerId() {
    return this._customerId;
  }

  getDeliveryDays(): number {
    return 3;
  }
}



class PremiumOrder implements IOrder {
  private _id: string | undefined;
  private _customerId: string;
  private _customerAddress: string;
  private _hasPriority: boolean;
  private _productIds: string[];

  constructor(
    orderData: OrderRawData
  ) {
    const { id, customer, productIds } = orderData;
    this._id = id;
    this._customerId = customer.getIdentifier();
    this._customerAddress = customer.getAddress();
    this._productIds = productIds;
    this._hasPriority = customer.hasPremiumSubscription();
  }

  getProductIds() {
    return this._productIds;
  }

  getCustomerId() {
    return this._customerId;
  }

  getDeliveryDays(): number {
    return 1;
  }
}


const printDeliveryDays = (order: IOrder) => console.log(order.getDeliveryDays());

// Priority orders have 1 day
class Customer implements ICustomer {
  private _id: string;
  private _address: string;
  private _subscriptionType: 'premium' | 'standard';

  constructor(id: string, address: string, subscriptionType: 'premium' | 'standard') {
    this._id = id;
    this._address = address;
    this._subscriptionType = subscriptionType;
  }

  getIdentifier(): string {
    return this._id;
  }

  getAddress(): string {
    return this._address;
  }

  hasPremiumSubscription(): boolean {
    return this._subscriptionType == 'premium';
  }
}

const orderFactory = (orderRawData: OrderRawData): IOrder => {
  if (orderRawData.customer.hasPremiumSubscription()) {
    return new PremiumOrder(orderRawData);
  } else {
    return new StandardOrder(orderRawData);
  }
}

const standard = orderFactory({
  customer: new Customer("1", "address", 'standard'),
  productIds: []
});

const premium = orderFactory({
  customer: new Customer("1", "address", 'premium'),
  productIds: []
});

printDeliveryDays(standard)
printDeliveryDays(premium)

export {};

```
In the refactored version we have reduced the parameters and used polymorphism to allow us to delete the flag parameter.

#### Knowledge Duplication

When the same codified knowledge is found in multiple places. Similar code is acceptable, sometimes we have similar processes
, but they should represent different pieces of knowledge. If there are units which refer to the same units of knowledge
then this can cause bugs when behaviour is changed. To fix this we extract the duplicate knowledge into helper functions or classes.
We do need to ensure that the helper functions or classes follow SOLID principles. We should not extract similar code that represents different knowledge.

```typescript
import { parseCustomerData, readCustomerProperties, readCustomersFromCsv } from "./utils";

const sendEmails = async () => {
  const customerLines = await readCustomersFromCsv();
  const customerProperties = await readCustomerProperties();
  const customers = parseCustomerData(customerLines, customerProperties);

  for (const customer of customers) {
    if (Boolean(customer.email)) {
      let emailMessage = "Hello " + customer.name + ",\n";
      emailMessage += "Thank you for subscribing to our newsletter!\n";

      console.log(emailMessage);
    }
  }
};

const displayCustomers = async () => {
  const customerLines = await readCustomersFromCsv();
  const customerProperties = await readCustomerProperties();
  const customers = parseCustomerData(customerLines, customerProperties);

  for (const customer of customers) {
    console.log("---\n");
    console.log(
      `Name: ${customer.name}\nEmail: ${customer.email || "None"}\nPhone: ${
        customer.phone || "None"
      }\n`
    );
  }
};

sendEmails();
displayCustomers();
```

First we eliminate the loops:

```typescript
import { parseCustomerData, readCustomerProperties, readCustomersFromCsv } from "./utils";

type CustomerRawData = {
  name: string | undefined,
  phone: string | undefined,
  email: string | undefined,
}

const sendEmail =  (customer: CustomerRawData) => {
  let emailMessage = "Hello " + customer.name + ",\n";
  emailMessage += "Thank you for subscribing to our newsletter!\n";

  console.log(emailMessage);
}

const sendEmails = async () => {
  const customerLines = await readCustomersFromCsv();
  const customerProperties = await readCustomerProperties();
  const customers = parseCustomerData(customerLines, customerProperties);
  customers
    .filter(customer => Boolean(customer.email))
    .forEach(customer => sendEmail(customer as CustomerRawData));
};


const displayCustomer = (customer: CustomerRawData) => {
  console.log("---\n");
  console.log(
    `Name: ${customer.name}\nEmail: ${customer.email || "None"}\nPhone: ${
      customer.phone || "None"
    }\n`
  );
}
const displayCustomers = async () => {
  const customerLines = await readCustomersFromCsv();
  const customerProperties = await readCustomerProperties();
  const customers = parseCustomerData(customerLines, customerProperties);
  customers.forEach(customer => displayCustomer(customer as CustomerRawData));
};

sendEmails();
displayCustomers();

```

We also refactor the customerData.ts file to return customers instead of showing the detailed working of the code:

```typescript
import fs from "fs";
import path from "path";
import readline from "readline";

export const readCustomersFromCsv = async (): Promise<Record<string, string | undefined>[]> => {
  const fileReader = fs.createReadStream(path.resolve(__dirname + "/customerData.csv"));
  const lineReader = readline.createInterface({
    input: fileReader,
    crlfDelay: Infinity,
  });
  let lineCounter = 0;
  const customerLines: string[] = [];
  const customerProperties = [];

  for await (const l of lineReader) {
    if (lineCounter === 0) {
      customerProperties.push(...l.split(","));
    }else {
      customerLines.push(l);
    }

    lineCounter++;
  }

  const customers = [];

  for (const line of customerLines) {
    const customer: { [index: string]: string | undefined } = {};
    const customerData = line.split(",");

    for (let i = 0; i < customerProperties.length; i++) {
      customer[customerProperties[i]] = Boolean(customerData[i]) ? customerData[i] : undefined;
    }

    customers.push(customer);
  }

  return customers;
};

```

The code now simply expects a list of Customers in each function:
```typescript
import { readCustomersFromCsv } from "./utils";

type CustomerRawData = {
  name: string | undefined,
  phone: string | undefined,
  email: string | undefined,
}

const sendEmail =  (customer: CustomerRawData) => {
  let emailMessage = "Hello " + customer.name + ",\n";
  emailMessage += "Thank you for subscribing to our newsletter!\n";

  console.log(emailMessage);
}

const sendEmails = async () => {
  const customers = await readCustomersFromCsv();
  customers
    .filter(customer => Boolean(customer.email))
    .forEach(customer => sendEmail(customer as CustomerRawData));
};


const displayCustomer = (customer: CustomerRawData) => {
  console.log("---\n");
  console.log(
    `Name: ${customer.name}\nEmail: ${customer.email || "None"}\nPhone: ${
      customer.phone || "None"
    }\n`
  );
}
const displayCustomers = async () => {
  const customers = await readCustomersFromCsv();
  customers.forEach(customer => displayCustomer(customer as CustomerRawData));
};

sendEmails();
displayCustomers();

```

#### Uninformative comments
Comments can be helpful but they should be well written. Bad comments do not add any information that cannot
be derived from the code itself. Good comments capture the reasoning behind complex code and should capture the intendeed
usage of the code. Uninformative comments pollute the code base and make it harder to read. They also add overhead to code
maintenance because they need to be updated. To fix comments, make the code clean and then delete comments that duplicate
information from the code. Add comments that capture thought processes that are not clear from the code.


