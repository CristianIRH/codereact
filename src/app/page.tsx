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

  const handleEvento = (name, value) => {
    setEvento({
      ...evento,
      [name]: name === "presupuesto" ? Number(value) : value
    });
  };

  const handleRegistrar = () => {};

  return (
    <div>
      <h1>Gestor de Eventos Comunitarios</h1>
      
      <div>
        <h2>Registrar Nuevo Evento</h2>
        <div>
          <div>
            <label>Nombre del Evento:</label><br/>
            <input
              name="nombre"
              type="text"
              placeholder="Ej: Paseo de curso"
              value={evento.nombre}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
            /><br/>
            <span>{errorNombre}</span>
          </div>

          <div>
            <label>Presupuesto:</label><br/>
            <input
              name="presupuesto"
              type="number"
              placeholder="Ej: 25000"
              value={evento.presupuesto || ''}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
            /><br/>
            <span>{errorPresupuesto}</span>
          </div>

          <div>
            <label>Tipo de Evento:</label><br/>
            <select
              name="tipo"
              value={evento.tipo}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
            >
              <option value="">Seleccione un tipo</option>
              <option value="cultural">Cultural</option>
              <option value="deportivo">Deportivo</option>
              <option value="educativo">Educativo</option>
              <option value="social">Social</option>
              <option value="benefico">Benéfico</option>
            </select><br/>
            <span>{errorTipo}</span>
          </div>

          <div>
            <label>Descripción:</label><br/>
            <textarea
              name="descripcion"
              placeholder="Describe el evento"
              value={evento.descripcion}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
              rows={4}
            /><br/>
            <span>{errorDescripcion}</span>
          </div>

          <div>
            <label>Fecha del Evento:</label><br/>
            <input
              name="fecha"
              type="date"
              value={evento.fecha}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
            /><br/>
            <span>{errorFecha}</span>
          </div>

          <button
            type="button"
            onClick={handleRegistrar}
          >
            Registrar Evento
          </button>
        </div>
      </div>

      <div>
        <h2>Eventos Registrados ({eventos.length})</h2>
        {eventos.length === 0 ? (
          <p>No hay eventos registrados aún.</p>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}