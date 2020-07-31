package dev.lumme.test;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SubClassTest {

    @Test
    void testDoubleUp() {
        SubClass subClass = new SubClass();
        int result = subClass.doubleUp(4);
        assertEquals(8, result);
    }
}