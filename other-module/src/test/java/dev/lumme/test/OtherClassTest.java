package dev.lumme.test;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OtherClassTest {

    @Test
    void testWhatIsMyName() {
        String result = new OtherClass().whatIsMyName("Bob");
        assertEquals("I have no IDEA", result);
    }
}