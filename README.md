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





### Code Smells