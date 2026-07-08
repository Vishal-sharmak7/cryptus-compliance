import db from "../config/db.js";

// Create Control
export const createControl = (req, res) => {
  const {
    framework_id,
    title,
    description,
    category
  } = req.body;

  if (!framework_id || !title) {
    return res.status(400).json({
      success: false,
      message:
        "framework_id and title required"
    });
  }

  const query = `
    INSERT INTO controls
    (framework_id,title,description,category)
    VALUES(?,?,?,?)
  `;

  db.query(
    query,
    [framework_id, title, description, category || null],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Control Created",
        controlId: result.insertId,
      });
    }
  );
};

export const getControlsByFramework = (
  req,
  res
) => {

  const { frameworkId } = req.params;

  db.query(
    `
    SELECT *
    FROM controls
    WHERE framework_id=?
    `,
    [frameworkId],
    (err, results) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        controls: results,
      });
    }
  );
};

export const getControls = (req, res) => {
  db.query(
    "SELECT * FROM controls ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        controls: results,
      });
    }
  );
};

export const getControlById = (
  req,
  res
) => {

  const { id } = req.params;

  db.query(
    `
    SELECT *
    FROM controls
    WHERE id=?
    `,
    [id],
    (err, results) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Control not found",
        });
      }

      res.json({
        success: true,
        control: results[0],
      });
    }
  );
};



// Update Control (title + description + category)
export const updateControl = (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  db.query(
    `UPDATE controls SET title=?, description=?, category=? WHERE id=?`,
    [title, description, category || null, id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Control updated" });
    }
  );
};


export const updateControlStatus = (
  req,
  res
) => {

  const { id } = req.params;

  const { status } = req.body;

  db.query(
    `
    UPDATE controls
    SET status=?
    WHERE id=?
    `,
    [status, id],
    (err) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message:
          "Control status updated",
      });
    }
  );
};



export const deleteControl = (
  req,
  res
) => {

  const { id } = req.params;

  db.query(
    `
    DELETE FROM controls
    WHERE id=?
    `,
    [id],
    (err) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message:
          "Control deleted",
      });
    }
  );
};