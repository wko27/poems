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

import * as db from 'db';

const initialState = {
  isLoginOpen: false,
  isLoggedIn: false,
  userId: undefined,
  username: undefined,
  email: undefined,
  emailVerified: false,
  accountError: undefined,
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
        if (user) {
          resolve(handleUserSignedIn(auth, user));
        } else {
          reject();
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

    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);

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
        created: new Date().valueOf(),
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

    const auth = getAuth();
    
    const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);

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

const signInReducer = (state, action) => {
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
      .addCase(checkLoggedIn.fulfilled, signInReducer)
      .addCase(login.fulfilled, signInReducer)
      .addCase(login.rejected, (state, action) => {
        const accountError = "Invalid password or email";

        return {
          ...state,
          accountError,
        };
      })
      .addCase(logout.fulfilled, (state, action) => {
        return initialState;
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
