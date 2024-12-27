// slug message list
exports.message = {
    SUCCESS: 'Success',
    FAILED: 'Failure',
    UNAUTH:  'You are not authorized!',
    ROLE_NOT_FOUND:  'Role not found!',
    USERID_REQ: 'User Id required in query',
    INVALID_DATE: "Invalid Date",
    NOT_ALLOWED_ORIGIN: "Origin not allowed",
    ORIGIN_NOT_FOUND:"Origin should be passed in headers",
    INTERNAL_ERROR: 'Internal Error!',
    EMP: {
        ADD: 'Successfully added an employee',
        UPDATE: 'Successfully updated an employee detail',
        GET: 'Successfully fetched an employee detail',
        GETALL: 'Successfully fetched all employee details',
        SEED: 'Data seeded to employees collection and logged',
        SEED_FAILURE: 'Seed failure and logged',
        EMP_NOT_EXIST: 'Employee not exist',
        INACTIVE_EMP: 'Inactive employee',
        NOT_SELF: 'You cannot update your data yourself!',
        NOT_PERMISSIBLE: 'You are not permissible to perform this action',
        DEPT_NOT_MATCHED: 'Update only respective department employees'
    },
    USER: {
        ALREADY_EXIST: "Already a registered user",
        REGISTER_DONE: "Successfully completed the registration",
        REGISTER_PENDING: "Not a registered user",
        LOGGED_IN: "Successfully logged in",
        INVALID_CREDENTIALS: "Invalid credentials, please try again!",
        WRONG_PASSWORD: "Wrong password entered!",
        NOT_AUTH_ROLE: "Not an authorized role",
        STATUS_CHANGED: "Successfully changed status",
        INVALID_FILE_EXT: "Invalid file extension",
        VERY_LARGE_FILE: "Very large file uploaded",
        SEED: 'Data seeded to users collection and logged',
        SEED_DONE: 'Data seeding completed',
        SEED_FAILED: 'Data seeding failed'
    },
    REDIS: {
        GET: 'Fetched redis data',
        SET: 'Created redis data',
        DELETE: 'Deleted redis data',
        UPDATE: 'Updated redis data',
        SET_ROLE: 'Role data exchanged'
    }
}