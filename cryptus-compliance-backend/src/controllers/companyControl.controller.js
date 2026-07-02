import db from "../config/db.js";

export const assignControl =
(req,res)=>{

    const {
        company_id,
        framework_id,
        control_id
    } = req.body;

    db.query(
        `
        INSERT INTO company_controls
        (
            company_id,
            framework_id,
            control_id
        )
        VALUES (?,?,?)
        `,
        [
            company_id,
            framework_id,
            control_id
        ],
        (err,result)=>{

            if(err){
                return res.status(500)
                .json({
                    success:false,
                    error:err.message
                });
            }

            res.status(201).json({
                success:true,
                message:
                "Control Assigned"
            });
        }
    );
};


export const getCompanyControls =
(req,res)=>{

    const { companyId } =
    req.params;

    const query = `
    SELECT

      cc.id,

      c.id AS control_id,

      c.title,

      c.description,

      cc.status,

      cc.notes

    FROM company_controls cc

    JOIN controls c
    ON cc.control_id = c.id

    WHERE cc.company_id = ?
    `;

    db.query(
        query,
        [companyId],
        (err,results)=>{

            if(err){
                return res.status(500)
                .json(err);
            }

            res.json({
                success:true,
                controls:results
            });
        }
    );
};


export const updateControlStatus =
(req,res)=>{

    const { id } =
    req.params;

    const {
        status,
        notes
    } = req.body;

    db.query(
        `
        UPDATE company_controls
        SET
        status=?,
        notes=?
        WHERE id=?
        `,
        [
            status,
            notes,
            id
        ],
        (err)=>{

            if(err){
                return res.status(500)
                .json(err);
            }

            res.json({
                success:true,
                message:
                "Status Updated"
            });
        }
    );
};


export const getComplianceScore =
(req,res)=>{

    const { companyId } =
    req.params;

    const query = `
    SELECT

      COUNT(*) as total,

      SUM(
        CASE
          WHEN status='COMPLETED'
          THEN 1
          ELSE 0
        END
      ) as completed

    FROM company_controls

    WHERE company_id = ?
    `;

    db.query(
      query,
      [companyId],
      (err,results)=>{

        if(err){
            return res.status(500)
            .json(err);
        }

        const total =
        results[0].total || 0;

        const completed =
        results[0].completed || 0;

        const score =
        total
        ? ((completed/total)*100)
            .toFixed(2)
        : 0;

        res.json({
            success:true,
            total,
            completed,
            score
        });
      }
    );
};


// De-assign (remove) a control from a company
export const deassignControl = (req, res) => {
  const { id } = req.params; // company_controls row id

  db.query(
    "DELETE FROM company_controls WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Control removed" });
    }
  );
};