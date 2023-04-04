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

#### Dep modules
Modules that have a lot of functionality which are exposed via a simple interface are called Deep modules.
These modules are easier to maintain and add more functionality.



### Code Smells

