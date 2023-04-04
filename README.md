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



