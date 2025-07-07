import { useState } from "react";
import Nota from "./components/Nota";
import "./styles/App.css";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { restrictToParentElement } from "@dnd-kit/modifiers";

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

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = notas.findIndex((n) => n.id === active.id);
      const newIndex = notas.findIndex((n) => n.id === over.id);
      setNotas((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="app-container">
      <button className="boton-crear" onClick={crearNotaNueva}>
        <img src="../public/sumar.svg" alt="" /> Añadir nota
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={notas.map((n) => n.id)} strategy={rectSortingStrategy}>
          <div className="contenedor-notas">
            {notas.map((nota) => (
              <Nota
                key={nota.id}
                {...nota}
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
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;
