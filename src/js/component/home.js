import React, { useEffect, useState } from "react";

function Home() {
	const BASE_URL = "https://assets.breatheco.de/apis/fake/todos/user/maruchf";
	const [tarea, guardarTarea] = useState("");
	const [lista, guardarLista] = useState([]);
	const eliminaItems = async (indexItem, listaActual) => {
		const listFilter = listaActual.filter(
			(todo, index) => index !== indexItem
		);

		if (listFilter.length > 0) {
			let response = await fetch(BASE_URL, {
				method: "PUT",
				body: JSON.stringify(listFilter),
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				guardarLista(listFilter);
			} else {
				alert("hay un error");
			}
		} else {
			let response = await fetch(BASE_URL, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				guardarLista([]);
			} else {
				alert("Epa pana hay un error");
			}
		}
	};

	useEffect(() => {
		const obtenerTareas = async path => {
			try {
				let response = await fetch(path);
				let APILista = await response.json();
				guardarLista(APILista);
			} catch (error) {
				console.log(error);
			}
		};
		let url = `${BASE_URL}`;
		obtenerTareas(url);
	}, []);

	return (
		<div className="container-fluid col-8">
			<h1 className="text-center">To do list</h1>
			<div className="Group">
				<input
					value={tarea}
					onKeyDown={async e => {
						if (e.keyCode == 13) {
							let nuevaLista = [];
							for (let i = 0; i < lista.length; i++) {
								nuevaLista.push(lista[i]);
							}

							nuevaLista.push({
								label: tarea,
								done: false
							});

							let response = await fetch(BASE_URL, {
								method: "PUT",
								body: JSON.stringify(nuevaLista),
								headers: {
									"Content-Type": "application/json"
								}
							});
							if (response.ok) {
								let response = await fetch(BASE_URL);
								let APILista = await response.json();
								guardarLista(APILista);
								guardarTarea("");
							} else {
								alert("intenta de nuevo, tienes un error");
							}
						}
					}}
					onChange={e => {
						guardarTarea(e.target.value);
					}}
					type="text"
					placeholder="Ingresa tus tareas aquí"
				/>
				<div className="card">
					<ul className="list-group list-group-flush">
						{lista.map((tarea, index) => {
							return (
								<li
									key={index}
									className="list-group-item d-flex justify-content-between"
									onClick={e =>
										eliminaItems(index, [...lista])
									}>
									{tarea.label}
									<div>
										<i className="fas fa-times" />
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="card-footer text-muted">
				<p>{lista.length} tareas pendientes</p>
			</div>
		</div>
	);
}

export default Home;
