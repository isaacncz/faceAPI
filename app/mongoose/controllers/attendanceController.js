var Attendance = require('../models/Attendance');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send('this site is valid');
  console.log('this site is valid');
};

exports.createNewAttendance = async function (req, res) {
  var Attendance = new Attendance({
    id: req.body.id,
    name: req.body.name,
    aveWeight: req.body.aveWeight,
    price: req.body.price,
    shortcode: req.body.shortcode,
    lastEdit: req.body.lastEdit,
    editBy: req.body.editBy,
  });

  try {
    const data = await Attendance.save(Attendance);
    res.send(data);
    // console.log("Attendance were created successfully!");
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating.',
    });
  }
};

exports.getAllAttendance = async (req, res) => {
  const data = await Attendance.find({});

  try {
    if (data.length > 0) {
      res.send(data);
    } else res.status(404).send({ message: 'No data.' });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while retrieving Attendance.',
    });
  }
};

exports.updateOneById = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;
  const data = await Attendance.findByIdAndUpdate(id, req.body, {
    upsert: false,
    useFindAndModify: false,
    returnOriginal: false,
  });
  try {
    if (!data) {
      res.status(404).send({
        message: `Cannot update Attendance with id=${id}. Maybe Attendance was not found!`,
      });
    } else {
      res.send({
        message: 'Attendance was updated successfully.',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating Attendance with id=' + id,
    });
  }
};

exports.deleteOneById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Attendance.findByIdAndRemove(id);
    if (!data) {
      res.status(404).send({
        message: `Cannot delete Attendance with id=${id}. Maybe Attendance was not found!`,
      });
    } else {
      res.send({
        message: 'Attendance was deleted successfully!',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Could not delete Attendance with id=' + id,
    });
  }
};
