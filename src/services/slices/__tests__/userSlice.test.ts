import userReducer, {
  userLogin,
  userRegister,
  userLogout,
  getUser,
  userUpdate,
  checkUserAuth,
  setAuthChecked,
  setUser,
  clearError,
  initialState
} from '../userSlice';

// Мок для cookie
jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

// Мок для localStorage
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
} as any;

// Константы для пользователя
const USER_EMAIL = 'test@example.com';
const USER_NAME = 'Test User';
const ACCESS_TOKEN = 'Bearer mock-token';
const REFRESH_TOKEN = 'mock-refresh-token';

// Моковые данные пользователя
const mockUser = {
  email: USER_EMAIL,
  name: USER_NAME
};

const mockLoginResponse = {
  success: true,
  user: mockUser,
  accessToken: ACCESS_TOKEN,
  refreshToken: REFRESH_TOKEN
};

const mockRegisterResponse = {
  success: true,
  user: mockUser
};

const mockUpdateResponse = {
  success: true,
  user: mockUser
};

const mockGetUserResponse = {
  success: true,
  user: mockUser
};

// Константы для сообщений об ошибках
const ERROR_LOGIN = 'Ошибка входа';
const ERROR_REGISTER = 'Ошибка регистрации';
const ERROR_LOGOUT = 'Ошибка выхода';
const ERROR_GET_USER = 'Не удалось получить пользователя';
const ERROR_UPDATE = 'Ошибка обновления';
const DEFAULT_ERROR = 'Some error';

describe('userSlice', () => {
  // 1. Начальное состояние
  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Асинхронные экшены', () => {
    describe('userLogin', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: userLogin.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать user и isLoading в false при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userLogin.pending.type });
        
        // Затем fulfilled
        const fulfilledAction = {
          type: userLogin.fulfilled.type,
          payload: mockLoginResponse
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать ошибку и isLoading в false при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userLogin.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: userLogin.rejected.type,
          error: { message: ERROR_LOGIN }
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(ERROR_LOGIN);
        expect(state.user).toBeNull();
      });

      it('должен обрабатывать стандартное сообщение об ошибке при отсутствии error.message', () => {
        const rejectedAction = {
          type: userLogin.rejected.type,
          error: {}
        };
        const state = userReducer(initialState, rejectedAction);
        
        expect(state.error).toBe(ERROR_LOGIN);
      });
    });

    describe('userRegister', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: userRegister.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать user и isLoading в false при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userRegister.pending.type });
        
        // Затем fulfilled
        const fulfilledAction = {
          type: userRegister.fulfilled.type,
          payload: mockRegisterResponse
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать ошибку и isLoading в false при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userRegister.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: userRegister.rejected.type,
          error: { message: ERROR_REGISTER }
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(ERROR_REGISTER);
        expect(state.user).toBeNull();
      });

      it('должен обрабатывать стандартное сообщение об ошибке при регистрации', () => {
        const rejectedAction = {
          type: userRegister.rejected.type,
          error: {}
        };
        const state = userReducer(initialState, rejectedAction);
        
        expect(state.error).toBe(ERROR_REGISTER);
      });
    });

    describe('userLogout', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: userLogout.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен очищать user и устанавливать isAuthChecked при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userLogout.pending.type });
        
        // Добавляем пользователя
        state = userReducer(state, {
          type: userLogin.fulfilled.type,
          payload: mockLoginResponse
        });
        
        expect(state.user).not.toBeNull();
        
        // Затем logout
        const fulfilledAction = {
          type: userLogout.fulfilled.type
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toBeNull();
        expect(state.isAuthChecked).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать ошибку и isLoading в false при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userLogout.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: userLogout.rejected.type,
          error: { message: ERROR_LOGOUT }
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(ERROR_LOGOUT);
      });

      it('должен обрабатывать стандартное сообщение об ошибке при logout', () => {
        const rejectedAction = {
          type: userLogout.rejected.type,
          error: {}
        };
        const state = userReducer(initialState, rejectedAction);
        
        expect(state.error).toBe(ERROR_LOGOUT);
      });
    });

    describe('getUser', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: getUser.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать user и isLoading в false при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: getUser.pending.type });
        
        // Затем fulfilled
        const fulfilledAction = {
          type: getUser.fulfilled.type,
          payload: mockGetUserResponse
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать ошибку и isLoading в false при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: getUser.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: getUser.rejected.type,
          error: { message: ERROR_GET_USER }
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(ERROR_GET_USER);
        expect(state.user).toBeNull();
      });

      it('должен обрабатывать стандартное сообщение об ошибке при getUser', () => {
        const rejectedAction = {
          type: getUser.rejected.type,
          error: {}
        };
        const state = userReducer(initialState, rejectedAction);
        
        expect(state.error).toBe(ERROR_GET_USER);
      });
    });

    describe('userUpdate', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: userUpdate.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен обновлять user и устанавливать isLoading в false при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userUpdate.pending.type });
        
        // Затем fulfilled
        const fulfilledAction = {
          type: userUpdate.fulfilled.type,
          payload: mockUpdateResponse
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать ошибку и isLoading в false при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: userUpdate.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: userUpdate.rejected.type,
          error: { message: ERROR_UPDATE }
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(ERROR_UPDATE);
        expect(state.user).toBeNull();
      });

      it('должен обрабатывать стандартное сообщение об ошибке при update', () => {
        const rejectedAction = {
          type: userUpdate.rejected.type,
          error: {}
        };
        const state = userReducer(initialState, rejectedAction);
        
        expect(state.error).toBe(ERROR_UPDATE);
      });
    });

    describe('checkUserAuth', () => {
      it('должен устанавливать isLoading в true при pending', () => {
        const action = { type: checkUserAuth.pending.type };
        const state = userReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать user и isAuthChecked при fulfilled', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: checkUserAuth.pending.type });
        
        // Затем fulfilled
        const fulfilledAction = {
          type: checkUserAuth.fulfilled.type,
          payload: mockUser
        };
        state = userReducer(state, fulfilledAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать isAuthChecked и user null при rejected', () => {
        // Сначала pending
        let state = userReducer(initialState, { type: checkUserAuth.pending.type });
        
        // Затем rejected
        const rejectedAction = {
          type: checkUserAuth.rejected.type
        };
        state = userReducer(state, rejectedAction);
        
        expect(state.isLoading).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toBeNull();
        expect(state.error).toBeNull();
      });
    });
  });

  describe('Синхронные экшены', () => {
    describe('setAuthChecked', () => {
      it('должен устанавливать флаг проверки авторизации в true', () => {
        const action = setAuthChecked(true);
        const state = userReducer(initialState, action);
        
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toBeNull();
      });

      it('должен устанавливать флаг проверки авторизации в false', () => {
        const stateWithAuthChecked = {
          ...initialState,
          isAuthChecked: true
        };
        
        const action = setAuthChecked(false);
        const state = userReducer(stateWithAuthChecked, action);
        
        expect(state.isAuthChecked).toBe(false);
        expect(state.user).toBeNull();
      });

      it('не должен изменять другие поля состояния', () => {
        const testState = {
          ...initialState,
          user: mockUser,
          isLoading: true,
          error: DEFAULT_ERROR
        };
        
        const action = setAuthChecked(true);
        const state = userReducer(testState, action);
        
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(DEFAULT_ERROR);
      });
    });

    describe('setUser', () => {
      it('должен устанавливать пользователя', () => {
        const action = setUser(mockUser);
        const state = userReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
      });

      it('должен очищать пользователя при передаче null', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser
        };
        
        const action = setUser(null);
        const state = userReducer(stateWithUser, action);
        
        expect(state.user).toBeNull();
      });

      it('не должен изменять другие поля состояния', () => {
        const testState = {
          ...initialState,
          isAuthChecked: true,
          isLoading: true,
          error: DEFAULT_ERROR
        };
        
        const action = setUser(mockUser);
        const state = userReducer(testState, action);
        
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(DEFAULT_ERROR);
      });
    });

    describe('clearError', () => {
      it('должен очищать ошибку', () => {
        const stateWithError = {
          ...initialState,
          error: DEFAULT_ERROR
        };
        
        const action = clearError();
        const state = userReducer(stateWithError, action);
        
        expect(state.error).toBeNull();
        expect(state.user).toBeNull();
      });

      it('не должен изменять другие поля при отсутствии ошибки', () => {
        const testState = {
          ...initialState,
          user: mockUser,
          isAuthChecked: true,
          isLoading: true
        };
        
        const action = clearError();
        const state = userReducer(testState, action);
        
        expect(state.error).toBeNull();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.isLoading).toBe(true);
      });
    });
  });
});
