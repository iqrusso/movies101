# Movies 101
Movies 101 è un'applicazione a singola pagina realizzata con *Vue.js* e *Vuetify*. I contenuti sono forniti dall'API di [The Movie Database](https://www.themoviedb.org/) (TMDb). Una demo è disponibile al link [movies101.tk](https://movies101.tk/).

## 1. Viste
L'app alterna due viste:

- L'elenco di film *(List.vue)*;
- La pagina di dettaglio di un singolo film *(Detail.vue)*.

I contenuti di queste viste variano in base alle proprietà passate nel routing. Ad esempio, le pagine */popular* e */top-rated* utilizzeranno lo stesso componente (*List.vue*), ma faranno una chiamata API diversa perché le rispettive proprietà `listToGet` sono diverse.  
Quindi, considerato il seguente endpoint:  
`https://api.themoviedb.org/3/movie/${this.listToGet}`  
al posto di `${this.listToGet}` potremo avere *popular*, *top_rated*, *upcoming*, *latest*, ecc.

## 2. Componenti
L'app fa un uso massiccio di card:

- **MovieCard**: è la card presente negli elenchi, che può essere verticale o orizzontale;
- **DetailMovieCard**: è la card presente nelle pagine di dettaglio.  

Per favorirne il riutilizzo le card sono state scomposte in sotto-componenti:

- **MovieCardImage**;
- **MovieCardTop**;
- **MovieCardBottom**.

In base alla pagina in cui si trovano, questi sotto-componenti cambiano stile e contenuto.

## 3. Interazione

### 3.1 Aggiungere il film a una collezione
L'utente può aggiungere i film a tre collezioni personali:

- Preferiti
- Cronologia
- Watchlist

Le pagine di queste tre collezioni sono sempre realizzate con il componente *List.vue*, ma hanno una proprietà `mode: "firebase"` che specifica che le liste di film non vanno ottenute tramite una chiamata API, ma attraverso Firebase. Nel database infatti sono archiviati gli ID dei film contenuti in queste collezioni: una volta ottenuti questi ID, per ognuno di loro può essere fatta una richiesta a TMDb.

In base alla presenza/assenza di un film in una collezione, i pulsanti cambieranno icona, colore e *tooltip*.

### 3.2 Valutare il film
Dalla pagina di dettaglio, l'utente può valutare il film da 1 a 5 stelle. Se l'utente non ha ancora espresso il voto per un film, allora sarà visualizzata la valutazione media degli altri utenti (colorata in grigio). Se invece l'utente ha espresso un proprio giudizio, verrà visualizzata la sua valutazione (colorata in rosso). Questa funzione è possibile grazie ai costrutti `get()` e `set()` all'interno di una proprietà *computed* in *MovieCardBottom.vue*.

## 4. Alcune soluzioni utilizzate

### 4.1 Generi dei film
Il componente *MovieCardTop.vue* tra i suoi contenuti ha anche l'elenco di generi di un film. I generi però vengono restituiti in maniera diversa dall'API in base alla chiamata che viene fatta.  
Se si richiede una lista di film (ad esempio i popolari), ogni oggetto-film avrà una proprietà di questo tipo:  
`"genre_ids": [12, 16, 35, 10751]`  
Se invece si richiedono le informazioni su un singolo film, l'oggetto avrà una proprietà diversa:  
`"genres":[ {"id":878,"name":"Fantascienza"}, {"id":28,"name":"Azione"} ]`  
È evidente che nel secondo caso è più semplice recuperare i nomi dei generi, perché sono esplicitati. Invece nel primo caso sarà necessario effettuare una "traduzione", cioè recuperare i nomi corrisponenti a quei numeri restituiti dall'API.

In ogni caso, per elencare i generi le card fanno riferimento a un metodo `filterGenres()`, che nella fase di creazione del componente controlla se l'API ha restituito `genre_ids` o `genres`. Nel primo caso gli ID verranno confrontati con un "dizionario" preso da TMDb e salvato in Vue al momento dell'istanziazione; nel secondo caso da ogni oggetto dell'array verrà semplicemente presa la chiave `name`.

### 4.2 Snackbar
Quando l'utente aggiunge il film a una collezione, compare una snackbar di feedback che permette anche di annullare l'azione. In totale quindi ci sono tre diverse snackbar che si possono vedere. All'interno di *MovieCardBottom.vue* però è stato utilizzato un solo componente `v-snackbar` il cui contenuto e funzionamento varia dinamicamente in base all'icona che è stata premuta. Quando si preme un'icona, si attiva il metodo `addMovie()` che — oltre ad aggiornare Firebase — modifica le proprietà `snackbar.active`, `snackbar.text` e `snackbar.collection`. Il pulsante "Annulla" della snackbar, quindi, attiverà un metodo `undo(collection)` dove l'argomento *"collection"* dipenderà dalla collezione cui si riferisce l'icona premuta, ovvero `snackbar.collection`.

### 4.3 Scrolling infinito
Anziché usare la paginazione, l'app sfrutta lo scrolling infinito. Il componente *Grid.vue*, dopo aver renderizzato le card di tutti i film contenuti nella propria lista, mostra il componente *Observer.vue*, il cui compito è emettere un evento *("pageEnd")* quando viene intersecato. Visualizzare questo componente infatti significa aver raggiunto la fine della pagina. L'evento *"pageEnd"* viene ascoltato dal componente genitore *List.vue* che carica altri film, se disponibili. La disponibilità di altri film viene controllata grazie alle chiavi `page` e `total_pages` degli oggetti restituiti da TMDb.