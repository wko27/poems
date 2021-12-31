import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  assertNonEmptyString,
} from 'utils';

import * as db from 'db';

const initialState = {
  isLoginOpen: false,
  isLoggedIn: false,
  userId: undefined,
  username: undefined,
  email: undefined,
  emailVerified: false,
  accountError: undefined,
  loginCheckComplete: false,
};

const handleUserSignedIn = async (auth, user) => {
  const {
    emailVerified,
    uid: userId,
    email,
  } = user;

  if (!emailVerified) {
    await sendEmailVerification(auth.currentUser);
    console.log(`Sending verification email`);
  }

  const userSnapshot = await db.read(
    `Loading user data for (${userId})`,
    db.paths().getUser(userId)
  );

  const { username } = userSnapshot.val();

  return {
    userId,
    username,
    email,
    emailVerified,
  };
}

export const checkLoggedIn = createAsyncThunk(
  'user/checkLoggedIn',
  async (arg, thunkAPI) => {
    const auth = getAuth();

    return new Promise((resolve, reject) =>
      onAuthStateChanged(auth, (user) => {
        const {
          loginCheckComplete,
        } = thunkAPI.getState().user;

        if (user) {
          if (!loginCheckComplete) {
            console.log(`Auth check complete, user is already signed in`);
            resolve(handleUserSignedIn(auth, user));
          }
        } else {
          if (!loginCheckComplete) {
            console.log(`Auth check complete, user is NOT signed in`);
            reject();
          }
        }
      })
    );
  }
);

export const registerAccount = createAsyncThunk(
  'user/register',
  async (arg, thunkAPI) => {
    const {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
    } = arg;

    assertNonEmptyString(enteredUsername, "Must provide a username");
    assertNonEmptyString(enteredEmail, "Must provide an email");
    assertNonEmptyString(enteredPassword, "Must provide a password");

    const profileSnapshot = await db.read(
      'Check username',
      db.paths().getProfile(enteredUsername)
    );

    if (profileSnapshot.exists()) {
      throw Error(`Username already taken`);
    }

    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);

    const createEpochMs = new Date().valueOf();

    const {
      user: {
        emailVerified,
        uid: userId,
        email,
      },
    } = userCredential;

    await db.update(
      'Create user',
      db.paths().getUser(userId),
      {
        username: enteredUsername,
        created: createEpochMs,
      }
    );

    await db.update(
      'Register username',
      db.paths().getProfile(enteredUsername),
      {
        userId,
        created: createEpochMs,
      }
    );

    await sendEmailVerification(auth.currentUser);

    return {
      userId,
      username: enteredUsername,
      email,
      emailVerified,
    };
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (enteredEmail, thunkAPI) => {
    assertNonEmptyString(enteredEmail, "Must provide an email");

    const auth = getAuth();
    await sendPasswordResetEmail(auth, enteredEmail);
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (arg, thunkAPI) => {
    const {
      email: enteredEmail,
      password: enteredPassword,
    } = arg;

    assertNonEmptyString(enteredEmail, "Must provide an email");
    assertNonEmptyString(enteredPassword, "Must provide a password");

    const auth = getAuth();
    
    const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);

    console.log(`User signed in`);

    return handleUserSignedIn(auth, userCredential.user);
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    const auth = getAuth();
    await signOut(auth);
  }
);

const signInReducer = (loginCheckComplete) => (state, action) => {
  const {
    userId,
    username,
    email,
    emailVerified,
  } = action.payload;

  if (!emailVerified) {
    return {
      ...state,
      isLoggedIn: false,
      isLoginOpen: true,
      accountError: "Please check your inbox for an account confirmation email"
    };
  }

  return {
    ...state,
    userId,
    username,
    email,
    emailVerified,
    isLoggedIn: true,
    isLoginOpen: false,
    loginCheckComplete: loginCheckComplete === undefined ? state.loginCheckComplete : loginCheckComplete,
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    openLogin: (state) => {
      return {
        ...state,
        isLoginOpen: true,
      };
    },
    closeLogin: (state) => {
      return {
        ...state,
        isLoginOpen: false,
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(registerAccount.fulfilled, (state, action) => {
        const {
          userId,
          username,
          email,
          emailVerified,
        } = action.payload;

        return {
          ...state,
          userId,
          username,
          email,
          emailVerified,
          isLoggedIn: true,
          isLoginOpen: false,
        };
      })
      .addCase(registerAccount.rejected, (state, action) => {
        const accountError = (action.error && action.error.message)
          ? action.error.message
          : "Invalid username, email, or password";

        return {
          ...state,
          accountError,
        };
      })
      .addCase(resetPassword.rejected, (state, action) => {
        const accountError = (action.error && action.error.message)
          ? action.error.message
          : "Invalid email";

        return {
          ...state,
          accountError,
        };
      })
      .addCase(checkLoggedIn.fulfilled, signInReducer(true))
      .addCase(checkLoggedIn.rejected, (state, action) => {
        return {
          ...state,
          loginCheckComplete: true,
        };
      })
      .addCase(login.fulfilled, signInReducer(undefined))
      .addCase(login.rejected, (state, action) => {
        const accountError = (action.error && action.error.message)
          ? action.error.message
          : "Invalid email or password";

        return {
          ...state,
          accountError,
        };
      })
      .addCase(logout.fulfilled, (state, action) => {
        console.log(`Logged out user`);
        return {
          ...initialState,
          loginCheckComplete: state.loginCheckComplete,
        };
      })
  },
})

export const {
  openLogin,
  closeLogin,
  openProfile,
  closeProfile,
} = userSlice.actions;

export default userSlice.reducer
