import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";

const HeroesAddForm = () => {
	const [heroName, setHeroName] = useState("");
	const [description, setDescription] = useState("");
	const [element, setElement] = useState("");

	const { filtersLoadingStatus } = useSelector((state) => state.filters);
	const filters = selectAll(store.getState());
	const { request } = useHttp();
	const dispatch = useDispatch();

	const createNewHero = (e) => {
		e.preventDefault();
		const newHero = {
			id: uuidv4(),
			name: heroName,
			description: description,
			element: element,
		};

		request(
			"http://localhost:3001/heroes",
			"POST",
			JSON.stringify(newHero)
		).then(dispatch(heroCreated(newHero)));

		setHeroName("");
		setDescription("");
		setElement("");
	};

	const renderFilters = (filters, status) => {
		if (status === "loading") {
			return <option>Загрузка элементов</option>;
		}

		if (status === "error") {
			return <option>Ошибка загрузки</option>;
		}

		if (filters && filters.length > 0) {
			return filters
				.filter(({ name }) => name !== "all")
				.map(({ name, label }) => (
					<option key={name} value={name}>
						{label}
					</option>
				));
		}

		return null;
	};

	return (
		<form className="border p-4 shadow-lg rounded" onSubmit={createNewHero}>
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">
					Имя нового героя
				</label>
				<input
					required
					type="text"
					name="name"
					className="form-control"
					id="name"
					placeholder="Как меня зовут?"
					value={heroName}
					onChange={(e) => setHeroName(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">
					Описание
				</label>
				<textarea
					required
					name="text"
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					style={{ height: "130px" }}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">
					Выбрать элемент героя
				</label>
				<select
					required
					className="form-select"
					id="element"
					name="element"
					value={element}
					onChange={(e) => setElement(e.target.value)}
				>
					<option value="">Я владею элементом...</option>
					{renderFilters(filters, filtersLoadingStatus)}
				</select>
			</div>
			<button type="submit" className="btn btn-primary">
				Создать
			</button>
		</form>
	);
};

export default HeroesAddForm;
