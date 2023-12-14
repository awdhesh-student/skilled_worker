const problemSchema = require("../schemas/problemModel");
const userSchema = require("../schemas/userModel");

////////////all users////////////////
const allUserControllers = async (req, res) => {
  try {
    const allUsers = await userSchema.find();

    if (!allUsers) {
      return res.status(401).send({ success: true, message: "No Users Found" });
    }

    return res.send({
      success: true,
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////////changing the type of user////
const changeTypeUserController = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userSchema.findByIdAndUpdate(
      userId,
      {
        $set: {
          type: "worker",
          // request: "no",
        },
      },
      {
        new: true,
      }
    );

    if (!user)
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });

    return res
      .status(200)
      .send({ success: true, message: "type change successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

///////get all works in admin portal with workers//////////
const getAllWorksWithWorkersController = async (req, res) => {
  try {
    const allWorks = await problemSchema.find();
    const allWorkers = await userSchema.find({
      type: "worker",
    });

    if (!allWorks && !allWorkers) {
      return res.status(404).send({
        success: false,
        message: "No data available!",
      });
    } else {
      return res.status(200).send({
        success: true,
        allworks: allWorks,
        allworkers: allWorkers,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

///////select worker by admin///////
const selectWorkerController = async (req, res) => {
  const { problemId } = req.params;
  const { workerID } = req.body;

  try {
    const worker = await userSchema.findById(workerID);

    const problem = await problemSchema.findByIdAndUpdate(
      { _id: problemId },
      { $set: { assigned: worker.name, workerId: workerID } },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: `Problem ${problem._id} has been assigned to ${worker.name}.`,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

module.exports = {
  allUserControllers,
  changeTypeUserController,
  getAllWorksWithWorkersController,
  selectWorkerController,
};
