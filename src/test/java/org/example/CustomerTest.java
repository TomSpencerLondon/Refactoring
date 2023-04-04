package org.example;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CustomerTest {

    @Test
    void test() {
        Customer customer = new Customer("Bob");

        customer.addRental(new Rental(new Movie("Jaws", Movie.REGULAR), 2));
        customer.addRental(new Rental(new Movie("GoldenEye", Movie.REGULAR), 3));
        customer.addRental(new Rental(new Movie("ShortNew", Movie.NEW_RELEASE), 1));
        customer.addRental(new Rental(new Movie("LongNew", Movie.NEW_RELEASE), 2));
        customer.addRental(new Rental(new Movie("Bambi", Movie.CHILDRENS), 3));
        customer.addRental(new Rental(new Movie("Toy Story", Movie.CHILDRENS), 4));

        assertEquals("Rental Record for Bob\n" +
                "\tJaws\t2.0\n" +
                "\tGoldenEye\t3.5\n" +
                "\tShortNew\t3.0\n" +
                "\tLongNew\t6.0\n" +
                "\tBambi\t1.5\n" +
                "\tToy Story\t3.0\n" +
                "You owed 19.0\n" +
                "You earned 7 frequent renter points", customer.statement());
    }
}
