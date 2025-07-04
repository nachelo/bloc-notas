import React, { useState, useRef, useEffect } from "react";
import "./Nota.css";

const coloresDefecto = [
	"#ff4d4d",
	"#4ade80",
	"#60a5fa",
	"#facc15",
	"#f472b6",
	"#9C27B0",
];

const mostrarFechaBonita = (fecha) => {
	if (!fecha) return "--/--/--";
	const [a, m, d] = fecha.split("-");
	return `${d}-${m}-${a}`;
};

const Nota = ({
	titulo,
	id,
	descripcion,
	fechaCreacion,
	fechaFin,
	color = "#ff4d4d",
	onEliminar,
	onCambiarColor,
	onActualizarTitulo,
	onActualizarDescripcion,
	onActualizarFechaFin,
	coloresPredefinidos = coloresDefecto,
	dragHandleProps,
}) => {
	const [editTitulo, setEditTitulo] = useState(false);
	const [editDescripcion, setEditDescripcion] = useState(false);
	const [editFechaFin, setEditFechaFin] = useState(false);

	const [inputTitulo, setInputTitulo] = useState(titulo);
	const [inputDescripcion, setInputDescripcion] = useState(descripcion);
	const [inputFechaFin, setInputFechaFin] = useState(fechaFin);

	const [mostrarSelector, setMostrarSelector] = useState(false);
	const [hexPersonalizado, setHexPersonalizado] = useState(color);
	const selectorRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (
				selectorRef.current &&
				!selectorRef.current.contains(e.target)
			) {
				setMostrarSelector(false);
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	useEffect(() => {
		setInputTitulo(titulo);
		setInputDescripcion(descripcion);
		setInputFechaFin(fechaFin);
	}, [titulo, descripcion, fechaFin]);

	return (
		<div className="nota-container" style={{ borderColor: color }}>
			{/* Cabecera */}
			<div className="nota-header">
				{editTitulo ? (
					<input
						className="nota-input-titulo"
						value={inputTitulo}
						onChange={(e) => setInputTitulo(e.target.value)}
						onBlur={() => {
							onActualizarTitulo(inputTitulo);
							setEditTitulo(false);
						}}
						autoFocus
					/>
				) : (
					<h2
						className="nota-titulo"
						onClick={() => setEditTitulo(true)}
						{...dragHandleProps}
					>
						{titulo || "Sin título"}
					</h2>
				)}

				<div className="nota-color-wrapper">
					<div
						className="nota-color"
						style={{ backgroundColor: color }}
						onClick={(e) => {
							e.stopPropagation();
							setMostrarSelector(!mostrarSelector);
						}}
						title="Cambiar color"
					></div>

					{mostrarSelector && (
						<div className="color-selector" ref={selectorRef}>
							<div className="color-preset-list">
								{coloresPredefinidos.map((c, i) => (
									<div
										key={i}
										className="color-preset"
										style={{ backgroundColor: c }}
										onClick={(e) => {
											e.stopPropagation();
											onCambiarColor(c);
											setHexPersonalizado(c);
											setMostrarSelector(false);
										}}
									></div>
								))}
							</div>
							<p>Introduce tu color personalizado</p>
							<div className="color-custom-input">
								<input
									type="text"
									value={hexPersonalizado}
									onChange={(e) =>
										setHexPersonalizado(e.target.value)
									}
									onKeyDown={(e) => {
										e.stopPropagation();
										if (e.key === "Enter") {
											if (
												/^#[0-9A-Fa-f]{6}$/.test(
													hexPersonalizado
												)
											) {
												onCambiarColor(
													hexPersonalizado
												);
												setMostrarSelector(false);
											}
										}
									}}
									placeholder="#HEX"
								/>
								<button
									onClick={(e) => {
										e.stopPropagation();
										if (
											/^#[0-9A-Fa-f]{6}$/.test(
												hexPersonalizado
											)
										) {
											onCambiarColor(hexPersonalizado);
											setMostrarSelector(false);
										}
									}}
								>
									OK
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Fechas */}
			<div className="nota-fechas">
				<div>
					<div className="nota-fecha">
						{mostrarFechaBonita(fechaCreacion)}
					</div>
					<div className="nota-etiqueta">Creada</div>
				</div>
				<div>
					{editFechaFin ? (
						<input
							type="date"
							className="nota-input-fecha"
							value={inputFechaFin}
							onChange={(e) => setInputFechaFin(e.target.value)}
							onBlur={() => {
								onActualizarFechaFin(inputFechaFin);
								setEditFechaFin(false);
							}}
							autoFocus
						/>
					) : (
						<>
							<div
								className="nota-fecha"
								onClick={() => setEditFechaFin(true)}
								style={{ cursor: "pointer" }}
							>
								{mostrarFechaBonita(fechaFin)}
							</div>
							<div className="nota-etiqueta">Fecha límite</div>
						</>
					)}
				</div>
			</div>

			{/* Descripción */}
			{editDescripcion ? (
				<textarea
					className="nota-textarea"
					value={inputDescripcion}
					onChange={(e) => {
						setInputDescripcion(e.target.value);
						const target = e.target;
						target.style.height = "auto";
						target.style.height = `${target.scrollHeight}px`;
					}}
					onBlur={(e) => {
						onActualizarDescripcion(inputDescripcion);
						setEditDescripcion(false);
						e.target.style.height = "auto";
						e.target.style.height = `${e.target.scrollHeight}px`;
					}}
					autoFocus
					style={{ overflow: "hidden", resize: "none" }}
				/>
			) : (
				<p
					className="nota-descripcion"
					onClick={() => setEditDescripcion(true)}
				>
					{descripcion || "Haz clic para escribir algo..."}
				</p>
			)}

			{/* Papelera */}
			<button
				className="nota-eliminar"
				onClick={() => onEliminar(id)}
				title="Eliminar nota"
			>
				🗑️
			</button>
		</div>
	);
};

export default Nota;
