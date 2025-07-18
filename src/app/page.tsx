'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from './firebase/Conexion';
import { registroEvento } from './firebase/promesa';

type Evento = {
  id: string;
  nombre: string;
  presupuesto: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  fechaCreacion?: string;
};

const initialStateEvento = {
  id: "",
  nombre: "",
  presupuesto: 0,
  tipo: "",
  descripcion: "",
  fecha: ""
};

export default function GestorEventos() {
  const [evento, setEvento] = useState(initialStateEvento);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoEditar, setEventoEditar] = useState(initialStateEvento);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [errorNombre, setErrorNombre] = useState("");
  const [errorPresupuesto, setErrorPresupuesto] = useState("");
  const [errorTipo, setErrorTipo] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [errorFecha, setErrorFecha] = useState("");

  const cargarEventos = async () => {
    try {
      setCargando(true);
      const q = query(collection(db, "eventos"), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      const eventosFirebase: Evento[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        eventosFirebase.push({
          id: docSnap.id,
          nombre: data.nombre,
          presupuesto: data.presupuesto,
          tipo: data.tipo,
          descripcion: data.descripcion,
          fecha: data.fecha,
          fechaCreacion: data.fechaCreacion
        });
      });
      setEventos(eventosFirebase);
      console.log("Eventos cargados:", eventosFirebase);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      alert("Error al cargar eventos. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

useEffect(() => {
  cargarEventos();
}, []);

  const handleEvento = (name: keyof Evento, value: string | number) => {
    setEvento({
      ...evento,
      [name]: name === "presupuesto" ? Number(value) : value
    });

    if (name === "nombre") {
      if (typeof value === "string" && value.length < 3) {
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
      if (typeof value === "string" && value.length < 10) {
        setErrorDescripcion("La descripción debe tener al menos 10 caracteres");
      } else {
        setErrorDescripcion("");
      }
    }

    if (name === "fecha") {
      const fechaSeleccionada = new Date(value + 'T00:00:00');
      const fechaHoy = new Date();
      fechaHoy.setHours(0,0,0,0);
    if (fechaSeleccionada < fechaHoy) {
      setErrorFecha("La fecha no puede ser anterior a hoy");
    } else {
      setErrorFecha("");
    }
  }};


  const handleRegistrar = async () => {
    if (!evento.nombre || !evento.presupuesto || !evento.tipo || !evento.descripcion || !evento.fecha) {
      alert("Por favor complete todos los campos");
      return;
    }

    if (errorNombre || errorPresupuesto || errorTipo || errorDescripcion || errorFecha) {
      alert("Por favor corrija los errores antes de actualizar");
      return;
    }

    try {
      setCargando(true);
      await registroEvento({
        nombre: evento.nombre,
        presupuesto: evento.presupuesto,
        tipo: evento.tipo,
        descripcion: evento.descripcion,
        fecha: evento.fecha
      });
      setEvento(initialStateEvento);
      await cargarEventos();
      alert("¡Evento registrado exitosamente!");
    } catch (error) {
      console.error("Error al registrar evento:", error);
      alert("Error al registrar evento. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleEditarEvento = (eventoAEditar: Evento) => {
    setEventoEditar({ ...eventoAEditar });
    setModoEdicion(true);
    setEvento(initialStateEvento);
  };

  const handleEventoEditar = (name: keyof Evento, value: string | number) => {
    setEventoEditar({
      ...eventoEditar,
      [name]: name === "presupuesto" ? Number(value) : value
    });
  };

  const handleEliminar = async (id: string) => {
  if (window.confirm("¿Está seguro que desea eliminar este evento?")) {
    try {
      setCargando(true);
      await deleteDoc(doc(db, "eventos", id));
      await cargarEventos();
      alert("¡Evento eliminado exitosamente!");
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      alert("Error al eliminar evento. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }
  };

const handleActualizar = async () => {
  if (!eventoEditar.nombre || !eventoEditar.presupuesto || !eventoEditar.tipo || !eventoEditar.descripcion || !eventoEditar.fecha) {
    alert("Por favor complete todos los campos");
    return;
  }
  try {
    setCargando(true);
    const eventoRef = doc(db, "eventos", eventoEditar.id);
    await updateDoc(eventoRef, {
      nombre: eventoEditar.nombre,
      presupuesto: eventoEditar.presupuesto,
      tipo: eventoEditar.tipo,
      descripcion: eventoEditar.descripcion,
      fecha: eventoEditar.fecha
    });
    setModoEdicion(false);
    setEventoEditar(initialStateEvento);
    setEvento(initialStateEvento);
    await cargarEventos();
    alert("¡Evento actualizado exitosamente!");
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    alert("Error al actualizar evento. Por favor, intenta de nuevo.");
  } finally {
    setCargando(false);
  }
};

  return (
    <div>
      <h1>Gestor de Eventos Comunitarios</h1>
      
      <div>
        <h2>{modoEdicion ? 'Editar Evento' : 'Registrar Nuevo Evento'}</h2>
        <div>
          <div>
            <label>Nombre del Evento:</label><br/>
            <input
              name="nombre"
              type="text"
              placeholder="Ej: Paseo de curso"
              value={modoEdicion ? eventoEditar.nombre : evento.nombre}
              onChange={(e) => modoEdicion ? handleEventoEditar(e.target.name as keyof Evento, e.target.value) : handleEvento(e.target.name as keyof Evento, e.target.value)}
              disabled={cargando}
            /><br/>
            <span style={{color: 'red'}}>{errorNombre}</span>
          </div>

          <div>
            <label>Presupuesto:</label><br/>
            <input
              name="presupuesto"
              type="number"
              placeholder="Ej: 25000"
              value={modoEdicion ? (eventoEditar.presupuesto || '') : (evento.presupuesto || '')}
              onChange={(e) => modoEdicion ? handleEventoEditar(e.target.name as keyof Evento, e.target.value) : handleEvento(e.target.name as keyof Evento, e.target.value)}
              disabled={cargando}
            /><br/>
            <span style={{color: 'red'}}>{errorPresupuesto}</span>
          </div>

          <div>
            <label>Tipo de Evento:</label><br/>
            <select
              name="tipo"
              value={modoEdicion ? eventoEditar.tipo : evento.tipo}
              onChange={(e) => modoEdicion ? handleEventoEditar(e.target.name as keyof Evento, e.target.value) : handleEvento(e.target.name as keyof Evento, e.target.value)}
              disabled={cargando}
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
              value={modoEdicion ? eventoEditar.descripcion : evento.descripcion}
              onChange={(e) => modoEdicion ? handleEventoEditar(e.target.name as keyof Evento, e.target.value) : handleEvento(e.target.name as keyof Evento, e.target.value)}
              rows={4}
              disabled={cargando}
            /><br/>
            <span style={{color: 'red'}}>{errorDescripcion}</span>
          </div>

          <div>
            <label>Fecha del Evento:</label><br/>
            <input
              name="fecha"
              type="date"
              value={modoEdicion ? eventoEditar.fecha : evento.fecha}
              onChange={(e) => modoEdicion ? handleEventoEditar(e.target.name as keyof Evento, e.target.value) : handleEvento(e.target.name as keyof Evento, e.target.value)}
              disabled={cargando}
            /><br/>
            <span style={{color: 'red'}}>{errorFecha}</span>
          </div>

          {modoEdicion ? (
            <>
              <button
                type="button"
                onClick={handleActualizar}
                disabled={cargando}
              >
                {cargando ? "Actualizando..." : "Actualizar Evento"}
              </button>
              <button
                type="button"
                onClick={() => { setModoEdicion(false); setEventoEditar(initialStateEvento); setEvento(initialStateEvento); }}
                disabled={cargando}
                style={{marginLeft: '10px'}}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleRegistrar}
              disabled={cargando}
            >
              {cargando ? "Registrando..." : "Registrar Evento"}
            </button>
          )}
        </div>
      </div>



      <div>
        <h2>Eventos Registrados ({eventos.length})</h2>
        {eventos.length === 0 ? (
          <p>No hay eventos registrados aún.</p>
        ) : (
          <div>
            {eventos.map((e) => (
              <div key={e.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
                <h3>{e.nombre || 'Sin nombre'}</h3>
                <p><strong>Tipo:</strong> {e.tipo || 'Sin tipo'}</p>
                <p><strong>Presupuesto:</strong> ${typeof e.presupuesto === 'number' ? e.presupuesto.toLocaleString() : '0'}</p>
                <p><strong>Fecha:</strong> {e.fecha || 'Sin fecha'}</p>
                <p><strong>Descripción:</strong> {e.descripcion || 'Sin descripción'}</p>
                <p><small>Creado: {e.fechaCreacion ? new Date(e.fechaCreacion).toLocaleString() : 'Sin fecha'}</small></p>
                <div>
                  <button onClick={() => handleEditarEvento(e)} disabled={cargando} style={{marginRight: '10px'}}>Editar</button>
                  <button onClick={() => handleEliminar(e.id)} disabled={cargando} style={{color: 'red'}}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};