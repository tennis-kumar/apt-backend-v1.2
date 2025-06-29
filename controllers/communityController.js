import Flat from '../models/Flat.js';

export const getFloors = async (req, res) => {
  try {
    const user = req.user;
    const flat = await Flat.findById(user.flat);
    
    const floors = await Flat.aggregate([
      { 
        $match: { apartment: flat.apartment } 
      },
      {
        $group: {
          _id: "$floorNumber",
          rooms: {
            $push: {
              name: "$flatNumber",
              phoneNumber: "$resident.phone",
              residentName: "$resident.name"
            }
          }
        }
      },
      {
        $project: {
          name: { $concat: ["Floor ", { $toString: "$_id" }] },
          rooms: 1,
          _id: 0
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.json({
      status: 'success',
      data: floors
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};