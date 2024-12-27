exports.validDept = Object.freeze({
  1: "Web Dev",
  2: "Data Science",
  3: "Mobile Dev",
  4: "Data Analyst",
  5: "Testing",
  6: "UI/UX",
  7: "IT Admin",
  8: "HR",
  9: "Others",
});

exports.currentStatus = Object.freeze({
  ACTIVE: "1",
  INACTIVE: "0",
});

exports.createdBy = Object.freeze({
  SELF: "1",
  ADMIN: "2",
});

exports.uploadFileCols = {
  1: ["name", "Name"],
  2: ["emailid", "emailId", "EmailID", "EmailId", "Email"],
  3: ["contact number", "Contact Number", "Contact Number", "contactNumber"],
  4: ["password", "Password"],
  5: ["dept", "department", "Department"],
  6: ["dateOfJoin", "doj", "date of join", "Date Of Join"],
  7: ["role", "Role"],
};

exports.rolesPermission = {
  'Admin': ['1'],
  'Manager': ['1','2'],
  'Employee': ['1','2','3']
}

exports.updatePermission = {
  'Admin': ['1','2','3'],
  'Manager': ['3']
}

exports.redisSlug = {
  SET: 'EMS_ROLE_SLUG'
}