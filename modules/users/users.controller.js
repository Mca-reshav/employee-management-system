const { roleDesc } = require("../../models/users.md");
const { currentStatus } = require("../../services/constants.sv");
const { message } = require("../../services/messages.sv");
const { find, updateOne, aggregation } = require("../../services/mongo.sv");
const { error, log, success } = require("../../services/response.sv");
const path = require("path");
const moment = require("moment");
const fs = require('fs');
const { parseCSV } = require("../../services/parser.sv");
const { seedData } = require("../../services/seeder.sv");
const { format } = require("@fast-csv/format");
const ExcelJS = require("exceljs"); 
const { getAggregated } = require("../../services/aggregator.sv");

exports.toggleStatus = async (req, res) => {
  try {
    const empId = req.body.empId;
    const checkRole = req.user.role == Object.keys(roleDesc)[0];
    if (!checkRole) {
      return res.json(log(false, message.USER.NOT_AUTH_ROLE, {}));
    } else {
      const getStatus = await find({
        model: "UserEMS",
        query: { userId: empId },
        attributes: ["status"],
      });
      if (getStatus.length != 1) return res.json(log(false, message.USER.REGISTER_PENDING))
      const toggleStatus =
        getStatus[0].status == currentStatus.ACTIVE
          ? currentStatus.INACTIVE
          : currentStatus.ACTIVE;
      const updateStatus = await updateOne({
        model: "UserEMS",
        query: { userId: empId },
        data: { status: toggleStatus },
      });
      if (updateStatus?.modifiedCount) {
        success(true, message.USER.STATUS_CHANGED, {});
        return res.json(log(true, message.USER.STATUS_CHANGED, {}));
      }
      return res.json(log(false, message.FAILED, {}));
    }
  } catch (err) {
    error(err);
  }
};

exports.uploadList = async (req, res) => {
  try {
    const { originalname, buffer, size } = req.file;

    const extName = path.extname(originalname);
    if (extName != ".csv") {
      return res.json(log(false, message.USER.INVALID_FILE_EXT, {}));
    }
    if (parseFloat(size / 1024) > 2048) {
      return res.json(log(false, message.USER.VERY_LARGE_FILE, {}));
    }
    let getData = await parseCSV(buffer);
    const seederResp = await seedData(getData);
    if (seederResp?.success) {
      success(true, message.USER.SEED_DONE);
      return res.json(
        log(true, message.USER.SEED_DONE, seederResp?.data || {})
      );
    }
    return res.json(log(false, message.USER.SEED_FAILED));
  } catch (err) {
    error(err);
  }
};

exports.downloadList = async (req, res) => {
  try {
    const { page, limit, fileType } = req.body;
    const getData = await getAggregated(page, limit);
    await generateFile(fileType, getData, res);
  } catch (err) {
    error(err);
  }
};

const generateFile = async (fileType, getData, res) => {
  try {
    const currentStamp = moment().format("YYYYMMDD_HHmmss");
    const folderPath = path.join(__dirname, "../../public/uploads/");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (fileType == "1") {
      const csvFile = `emp_details_csv${currentStamp}.csv`;
      const filePath = path.join(folderPath, csvFile);

      const writableStream = fs.createWriteStream(filePath);
      const csvStream = format({ headers: true });
      csvStream.pipe(writableStream);

      getData.forEach((row) => csvStream.write(row));
      csvStream.end();
      writableStream.on("finish", () => {
        res.download(filePath, (err) => {
          if (err) error(err);
          fs.unlinkSync(filePath);
        });
      });


    } else {
      const excelFile = `emp_details_excel${currentStamp}.xlsx`;
      const filePath = path.join(folderPath, excelFile);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employee Details");

      worksheet.columns = [
        { header: "Employee Name", key: "empName", width: 30 },
        { header: "Email ID", key: "emailId", width: 30 },
        { header: "Contact No", key: "contactNo", width: 20 },
        { header: "Date of Joining", key: "doj", width: 20 },
        { header: "Department", key: "dept", width: 20 },
        { header: "Role", key: "role", width: 20 },
        { header: "Status", key: "status", width: 20 },
      ];

      getData.forEach((row) => {
        worksheet.addRow(row);
      });

      await workbook.xlsx.writeFile(filePath);
      res.download(filePath, (err) => {
        if (err) error(err);
        fs.unlinkSync(filePath);
      });

    }
  } catch (err) {
    error(err);
  }
};
