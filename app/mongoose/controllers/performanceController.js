var Performance = require('../models/Performance');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send('this site is valid');
  console.log('this site is valid');
};

exports.createNewPerformance = async function (req, res) {
  var jsonFormat = new Performance({
    date: req.body.date,
    name: req.body.name,
    metric: req.body.metric,
    output: req.body.output,
  });

  try {
    const data = await jsonFormat.save(jsonFormat);
    res.send(data);
    // console.log("Performance were created successfully!");
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating.',
    });
  }
};

exports.getAllPerformance = async (req, res) => {
  const data = await Performance.find({});

  try {
    if (data.length > 0) {
      res.send(data);
    } else res.status(404).send({ message: 'No data.' });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while retrieving Performance.',
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
  const data = await Performance.findByIdAndUpdate(id, req.body, {
    upsert: false,
    useFindAndModify: false,
    returnOriginal: false,
  });
  try {
    if (!data) {
      res.status(404).send({
        message: `Cannot update Performance with id=${id}. Maybe Performance was not found!`,
      });
    } else {
      res.send({
        message: 'Performance was updated successfully.',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating Performance with id=' + id,
    });
  }
};

exports.deleteOneById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Performance.findByIdAndRemove(id);
    if (!data) {
      res.status(404).send({
        message: `Cannot delete Performance with id=${id}. Maybe Performance was not found!`,
      });
    } else {
      res.send({
        message: 'Performance was deleted successfully!',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Could not delete Performance with id=' + id,
    });
  }
};
