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

    if (name === "nombre") {
      if (value.length < 3) {
        setErrorNombre("El nombre debe tener al menos 3 caracteres");
      } else {
        setErrorNombre("");
      }
    }

    if (name === "presupuesto") {
      if (Number(value) <= 0) {
        setErrorPresupuesto("El presupuesto debe ser mayor a 0");
      } else {
        setErrorPresupuesto("");
      }
    }

    if (name === "tipo") {
      if (value === "") {
        setErrorTipo("Debe seleccionar un tipo de evento");
      } else {
        setErrorTipo("");
      }
    }

    if (name === "descripcion") {
      if (value.length < 10) {
        setErrorDescripcion("La descripción debe tener al menos 10 caracteres");
      } else {
        setErrorDescripcion("");
      }
    }

    if (name === "fecha") {
      const fechaSeleccionada = new Date(value);
      const fechaHoy = new Date();
      if (fechaSeleccionada < fechaHoy) {
        setErrorFecha("La fecha no puede ser anterior a hoy");
      } else {
        setErrorFecha("");
      }
    }
  };

  const handleRegistrar = () => {
    if (!evento.nombre || !evento.presupuesto || !evento.tipo || !evento.descripcion || !evento.fecha) {
      alert("Por favor complete todos los campos");
      return;
    }

    if (errorNombre || errorPresupuesto || errorTipo || errorDescripcion || errorFecha) {
      alert("Por favor corrija los errores antes de registrar");
      return;
    }
  };

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
            <span style={{color: 'red'}}>{errorNombre}</span>
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
            <span style={{color: 'red'}}>{errorPresupuesto}</span>
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
            <span style={{color: 'red'}}>{errorTipo}</span>
          </div>

          <div>
            <label>Descripción:</label><br/>
            <textarea
              name="descripcion"
              placeholder="Describe el evento."
              value={evento.descripcion}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
              rows={4}
            /><br/>
            <span style={{color: 'red'}}>{errorDescripcion}</span>
          </div>

          <div>
            <label>Fecha del Evento:</label><br/>
            <input
              name="fecha"
              type="date"
              value={evento.fecha}
              onChange={(e) => handleEvento(e.target.name, e.target.value)}
            /><br/>
            <span style={{color: 'red'}}>{errorFecha}</span>
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