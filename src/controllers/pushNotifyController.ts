import { Request, Response } from "express";
import { messaging } from "firebase-admin";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../utils/firebaseConfig";
import userModel from "../models/User";

const tokenStrore = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await userModel.findById(req._id);
    await user?.updateOne({ deviceToken: token });

    return res.status(200).send({ message: "Token saved Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error", err: error });
  }
};

const pushNotify = async (req: Request, res: Response) => {
  try {
    // const { title, body,image } = req.body;
    const user = await userModel.findById(req._id);
    const deviceToken = user?.deviceToken;
    if (!deviceToken) {
      return res.status(400).send({ error: "Token not present" });
    }
    const message = {
      notification: {
        title: "Hello From Node",
        body: "Good Evening",
        image:'https://images.ctfassets.net/lzny33ho1g45/4jTlYSncnMPZ572fJvKCkI/f89b3b89be573c02d83046af4485434b/automate-notifications-00-hero.png?w=1520&fm=avif&q=30&fit=thumb&h=760'
      },
      token: deviceToken,
    };
    const response = await messaging().send(message);
    console.log("Successfully sent message:", response);
    res
      .status(200)
      .send({ message: "notification sent successfully", response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ error: error });
  }
};

const uplodMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "file field is empty" });
    }
    const image = req.file;
    console.log(image);
    const metaData = {
      contentType: image.mimetype,
    };
    let date = new Date().toISOString();
    console.log("metadata", metaData);
    const storageRef = await ref(storage, `${image.originalname}-${date}`);
    console.log("storageRef", storageRef);
    const sanpshot = await uploadBytesResumable(
      storageRef,
      image.buffer,
      metaData
    );
    console.log("snapshot", sanpshot);
    console.log("snapshot.ref", sanpshot.ref);
    const downloadedURL = await getDownloadURL(sanpshot.ref);
    console.log(downloadedURL);
    return res.status(200).send({
      message: "File uploaded to Firebase Storage",
      name: image.originalname,
      type: image.mimetype,
      url: downloadedURL,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export default { tokenStrore, pushNotify, uplodMedia };
