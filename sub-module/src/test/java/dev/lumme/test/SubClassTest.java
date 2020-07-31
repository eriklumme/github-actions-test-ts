package dev.lumme.test;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SubClassTest {

    @Test
    void testDoubleUp() {
        SubClass subClass = new SubClass();
        int result = subClass.doubleUp(3);
        assertEquals(6, result);
    }
}