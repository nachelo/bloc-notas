import { useState } from "react";
import Nota from "./components/Nota";
import "./styles/App.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function App() {
  const [notas, setNotas] = useState([]);

  const crearNotaNueva = () => {
    const nuevaNota = {
      id: crypto.randomUUID(),
      titulo: "",
      descripcion: "",
      color: "#fbbc04",
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaFin: "",
    };
    setNotas([...notas, nuevaNota]);
  };

  const actualizarNota = (id, nuevaData) => {
    setNotas((prev) =>
      prev.map((nota) => (nota.id === id ? { ...nota, ...nuevaData } : nota))
    );
  };

  const eliminarNota = (id) => {
    setNotas((prev) => prev.filter((nota) => nota.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const nuevasNotas = Array.from(notas);
    const [movedItem] = nuevasNotas.splice(result.source.index, 1);
    nuevasNotas.splice(result.destination.index, 0, movedItem);
    setNotas(nuevasNotas);
  };

  return (
    <div className="app-container">
      <button className="boton-crear" onClick={crearNotaNueva}>
        ➕ Añadir nota
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="zona-notas" direction="horizontal">
          {(provided) => (
            <div
              className="contenedor-notas"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {notas.map((nota, index) => (
                <Draggable key={nota.id} draggableId={nota.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Nota
                        {...nota}
                        dragHandleProps={provided.dragHandleProps}
                        onActualizarTitulo={(nuevoTitulo) =>
                          actualizarNota(nota.id, { titulo: nuevoTitulo })
                        }
                        onActualizarDescripcion={(nuevaDescripcion) =>
                          actualizarNota(nota.id, {
                            descripcion: nuevaDescripcion,
                          })
                        }
                        onActualizarFechaFin={(nuevaFecha) =>
                          actualizarNota(nota.id, { fechaFin: nuevaFecha })
                        }
                        onCambiarColor={(nuevoColor) =>
                          actualizarNota(nota.id, { color: nuevoColor })
                        }
                        onEliminar={() => eliminarNota(nota.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
