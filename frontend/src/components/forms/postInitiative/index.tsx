import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
export const PostInitiative = component$(() => {
    useStylesScoped$(styles);
    return (
        <>
            <div class="title form-div">
                <label for="title">Tittel</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="max 12 tegn"
                    maxLength={12}
                    required
                />
            </div>
            <div class="number form-div">
                <label for="max_attendees">Antall?</label>
                <select name="max_attendees" id="max_attendees" required>
                    <option value="not-specified">Ikke viktig</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div class="date form-div">
                <label for="date">Hvilken dag?</label>
                <input type="date" name="date" id="date" required />
            </div>
            <div class="clock form-div">
                <label for="clock">Klokka</label>
                <input type="time" name="clock" id="clock" required />
            </div>

            <div class=" form-div">
                <label for="category">Kategori</label>
                <select name="category" id="category">
                    <option value="egendefiner">Egendefiner</option>
                    <option value="natur">Natur</option>
                    <option value="kultur">Kultur</option>
                    <option value="trene">Trene</option>
                    <option value="spill">Spill</option>
                    <option value="foreldre-med-barn">Foreldre med barn</option>
                </select>
            </div>
            <div class="textarea-div">
                <label for="text">Skriv noe mer</label>
                <textarea name="text" id="text" cols={30} rows={5} required></textarea>
            </div>
            <div class="form-button">
                <button type="submit">INSJ!</button>
            </div>
        </>
    );
});
