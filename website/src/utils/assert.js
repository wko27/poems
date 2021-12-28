import * as _ from 'lodash';

const IS_NUMERIC_RE = /^-?\d*(\.\d+)?$/

export function assertNumericString(str, message) {
  assertType('string', str, message);

  if (message == null) {
    message = `Expected non-empty, numeric string, but found '${str}'`;
  }

  if (_.isEmpty(str) || str.match(IS_NUMERIC_RE) == null) {
    throw Error(message);
  }
}

export function assertNonEmptyString(str, message) {
  assertType('string', str, message);
  if (_.isEmpty(str)) {
    if (message == null) {
      message = `Expected non-empty string, but found '${str}'`;
    }
    throw Error(message);
  }
}

export function assertStringLength(expected, str, message) {
  assertType('string', str, message);

  if (expected === str.length) {
    return;
  }

  if (message == null) {
    message = `Expected '${str}' to have length ${expected}, but was ${str.length}`;
  }
  throw Error(message);
}

export function assertContains(expected, arg, message) {
  assertIsArray(expected, message);

  for (const value of expected) {
    if (value === arg) {
      return;
    }
  }

  if (message == null) {
    message = `Expected ${arg} to be contained in ${expected}`;
  }
  throw Error(message);
}

export function assertEquals(expected, arg, message) {
  if (expected !== arg) {
    if (message == null) {
      message = `Expected ${expected} but found ${arg}`;
    }
    throw Error(message);
  }
}

export function assertDeepEquals(expected, arg, message) {
  if (!_.isEqual(expected, arg)) {
    if (message == null) {
      message = `Expected ${expected} but found ${arg}`;
    }
    throw Error(message);
  }
}

export function assertNotEquals(expected, arg, message) {
  if (expected === arg) {
    if (message == null) {
      message = `Did not expect ${expected} but found ${arg}`;
    }
    throw Error(message);
  }
}

export function assertNotEmpty(arg, message) {
  if (_.isEmpty(arg)) {
    if (message == null) {
      message = `Expected a non-empty argument, but found ${arg}`;
    }
    throw Error(message);
  }
}

export function assertNotNull(arg, message) {
  if (arg == null) {
    if (message == null) {
      message = `Expected a non-null argument`;
    }
    throw Error(message);
  }
}

export function assertIsArray(arg, message) {
  if (!Array.isArray(arg)) {
    throw Error(message);
  }
}

export function assertTrue(arg, message) {
  if (arg !== true) {
    if (message == null) {
      message = `Expected true, but was ${arg}`;
    }
    throw Error(message);
  }
}

export function assertFalse(arg, message) {
  if (arg !== false) {
    if (message == null) {
      message = `Expected false, but was ${arg}`;
    }
    throw Error(message);
  }
}

export function assertType(expectedType, arg, message) {
  const actualType = typeof arg;
  if (expectedType !== actualType) {
    if (message == null) {
      message = `Expected ${expectedType} but found ${actualType}`;
    }
    throw Error(message);
  }
}
