const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/Task.json');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Helper functions
const readTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};


router.get('/', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Add task route
router.post('/addtasks', (req, res) => {
  const { id, title, description } = req.body;

  if (!id || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if the task ID already exists
  const existingTask = tasks.find(task => task.id === id);
  if (existingTask) {
      return res.status(400).json({ error: 'Task ID already exists' });
  }

  // Add the new task
  const newTask = { id, title, description, status: false };
  tasks.push(newTask);

  // Save the updated tasks to the JSON file
  fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), err => {
      if (err) {
          return res.status(500).json({ error: 'Failed to save tasks' });
      }

      res.status(201).json(newTask);
  });
});

// @route   POST api/tasks
// @desc    Create A Task
// @access  Public
//now().toString()
router.post('/', upload.none(), (req, res) => {
  const tasks = readTasks();

  //console.log('req : '+req.body.title); 
  //return false;
  let k1 = parseFloat(tasks.length)+1;
  if(k1<10) {
    k1='0'+k1;
  }

  /*const newTask = {
    id: k1,
    title: 'Amar More',
    description: 'Some Text will come here.',
    status: false
  };*/
  const newTask = {
    id: k1,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(tasks);
});

// @route   PUT api/tasks/:id
// @desc    Update A Task
// @access  Public
router.put('/:id', (req, res) => {
  let tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  };

  writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// @route   DELETE api/tasks/:id
// @desc    Delete A Task
// @access  Public
router.delete('/:id', (req, res) => {
  let tasks = readTasks();
  const newTasks = tasks.filter(task => task.id !== req.params.id);

  if (tasks.length === newTasks.length) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  writeTasks(newTasks);
  res.json({ success: true });
});

module.exports = router;
