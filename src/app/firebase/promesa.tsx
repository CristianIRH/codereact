import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./Conexion";

export const registroEvento = async (evento: {
  nombre: string;
  presupuesto: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "eventos"), {
      nombre: evento.nombre,
      presupuesto: evento.presupuesto,
      tipo: evento.tipo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      timestamp: serverTimestamp() 
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};