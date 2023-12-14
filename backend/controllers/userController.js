const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const userSchema = require("../schemas/userModel");
const problemSchema = require("../schemas/problemModel");

//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res
      .status(201)
      .send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////for the login////////////////////////////////////
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

/////request for changing type to admin by user/////
// const requestToChangeTypeController = async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const user = await userSchema.findByIdAndUpdate(
//       userId,
//       { $set: { request: "yes" },
//       work_descrpition: req.body
//      },
//       { new: true }
//     );

//     await user.save();
//     return res.status(200).send({
//       success: true,
//       message: `Request sent successfully to Admin`,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send({ success: false, message: `${error.message}` });
//   }
// };

const requestToChangeTypeController = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userSchema.findByIdAndUpdate(
      userId,
      {
        $set: {
          request: "yes",
          work_description: req.body
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: `User with ID ${userId} not found`,
      });
    }

    await user.save();
    return res.status(200).send({
      success: true,
      message: `Request sent successfully to Admin`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};


//////////sending the problem by user//////////
const sendProblemController = async (req, res) => {
  try {
    let problemData = { ...req.body }; // Copy req.body to avoid direct mutation
    /// console.log(problemData)
    if (req.file) {
      problemData.file = {
        name: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const problem = new problemSchema(problemData); // Create a new instance of the problem

    // Save the problem to the database
    const savedProblem = await problem.save();

    // Return a success message or savedProblem data in the response
    return res
      .status(200)
      .send({ success: true, message: "Problem sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////////fetching all problems by particular user/////////
const sendAllProblemsController = async (req, res) => {
  try {
    const allproblems = await problemSchema.find({
      userId: req.body.userId,
    });

    if (!allproblems) {
      return res.status(404).send({
        success: false,
        message: "No Problem Found",
      });
    } else {
      return res.status(200).send({
        success: true,
        allProblems: allproblems,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

/////fetching all problems to particular worker////////////
const sendAllProblemsWorkerController = async (req, res) => {
  try {
    const allproblems = await problemSchema.find({
      workerId: req.body.userId,
    });

    if (!allproblems) {
      return res.status(404).send({
        success: false,
        message: "No Problem Found",
      });
    } else {
      return res.status(200).send({
        success: true,
        allProblems: allproblems,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

//////////file download from teacher
const fileDownloadController = async (req, res) => {
  const problemId = req.query.problemId;
  try {
    const problem = await problemSchema.findById(problemId);

    if (!problem) {
      return res.status(404).send({ message: "problem not found" });
    }

    // Assuming that the document URL is stored in the "document" field of the appointment
    const fileUrl = problem.file?.path; // Use optional chaining to safely access the property

    if (!fileUrl || typeof fileUrl !== "string") {
      return res
        .status(404)
        .send({ message: "file URL is invalid", success: false });
    }

    // Construct the absolute file path
    const absoluteFilePath = path.join(__dirname, "..", fileUrl);

    // Check if the file exists before initiating the download
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(404)
          .send({ message: "File not found", success: false, error: err });
      }

      // Set appropriate headers for the download response
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Stream the file data to the response
      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.on("error", (error) => {
        console.log(error);
        return res.status(500).send({
          message: "Error reading the document",
          success: false,
          error: error,
        });
      });
      // Pipe the fileStream to the response
      fileStream.pipe(res);

      // Send the response after the file stream ends (file download is completed)
      fileStream.on("end", () => {
        res.end();
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

//////////change status by worker//////////
const changeStatusController = async (req, res) => {
  const { problemId } = req.params;
  try {
    const problem = await problemSchema.findById(problemId);

    if (!problem) {
      return res.status(404).send({
        message: "Problem not found",
        success: false,
      });
    }

    problem.status = "completed";
    await problem.save();

    return res.status(200).send({
      success: true,
      message: "Problem status changed",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  requestToChangeTypeController,
  sendProblemController,
  sendAllProblemsController,
  sendAllProblemsWorkerController,
  fileDownloadController,
  changeStatusController,
};
