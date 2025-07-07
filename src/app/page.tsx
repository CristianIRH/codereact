'use client'

import React, { useState, useEffect } from 'react';

const initialStateEvento = {
  id: 0,
  nombre: "",
  presupuesto: 0,
  tipo: "",
  descripcion: "",
  fecha: ""
};

export default function GestorEventos() {
  const [evento, setEvento] = useState(initialStateEvento);
  const [eventos, setEventos] = useState([]);
  const [eventoEditar, setEventoEditar] = useState(initialStateEvento);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const [errorNombre, setErrorNombre] = useState("");
  const [errorPresupuesto, setErrorPresupuesto] = useState("");
  const [errorTipo, setErrorTipo] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [errorFecha, setErrorFecha] = useState("");

  useEffect(() => {
    const eventosGuardados = localStorage.getItem("eventos");
    if (eventosGuardados) {
      const listadoEventos = JSON.parse(eventosGuardados);
      setEventos(listadoEventos);
    }
  }, []);

  return (
    <div>
      <h1>Gestor de Eventos Comunitarios</h1>
    </div>
  );
}