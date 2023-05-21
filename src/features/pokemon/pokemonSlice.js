import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loadingList: false,
    loadingNextBatch: false,
    list: [],
    detailLoaded: [],
    selection: [],
    offset: 0,
    limit: 20,
    error: ''
}

export const fetchList = createAsyncThunk('pokemon/fetchList', () => {
    return axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
    .then(response => response.data.results)
})

export const fetchDetail = createAsyncThunk('pokemon/fetchDetail', (pokemonUrl) => {
    return axios.get(pokemonUrl)
    .then(response => response.data)
}, )

export const fetchNextBatch = () => {
    return async(dispatch, getState) => {
        dispatch(pokemonSlice.actions.setLoadingNextBatch(true));

        const { list, detailLoaded, limit, offset } = getState().pokemon;
        const start = offset;
        const end = offset + limit;
        const promises = [];

        for (let i = start; i < end; i++) {
            const pokemon = list[i];
            if(!detailLoaded[pokemon.name]) {
                promises.push(dispatch(fetchDetail(pokemon.url)));
            }
        }

        await Promise.all(promises);

        dispatch(increaseOffset());
        dispatch(pokemonSlice.actions.setLoadingNextBatch(false));
    }
}

export const removeSelection = () => {
    return (dispatch, getState) => {
        const selection = getState().pokemon.selection;

        selection.forEach(pokemonName => {
            dispatch(removePokemon(pokemonName))
        });

        dispatch(clearSelection());
    }
}

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {
        setLoadingNextBatch: (state, action) => {
            state.loadingNextBatch = action.payload;
        },
        increaseOffset: state => {
            state.offset += state.limit;
        },
        selectPokemon: (state, action) => {
            !state.selection.includes(action.payload) && 
                state.selection.push(action.payload)
        },
        deselectPokemon: (state, action) => {
            state.selection = state.selection.filter(pokemonName => pokemonName != action.payload);
        },
        clearSelection: state => {
            state.selection = [];
        },
        removePokemon: (state, action) => {
            const targetName = action.payload;
            state.list = state.list.filter(pokemon => pokemon.name !== targetName);

            const filteredArray = Object.entries(state.detailLoaded).filter(([key, value]) => key !== targetName);
            state.detailLoaded = Object.fromEntries(filteredArray);
        }
    },
    extraReducers: builder => {
        //** F E T C H   L I S T *//
        builder.addCase(fetchList.pending, state => {
            state.loadingList = true;
        })
        builder.addCase(fetchList.fulfilled, (state, action) => {
            state.loadingList = false;
            state.list = action.payload;
            state.error = '';
        })
        builder.addCase(fetchList.rejected, (state, action) => {
            state.loadingList = false;
            state.list = [];
            state.error = action.error;
        })

        //** F E T C H   D E T A I L *//
        builder.addCase(fetchDetail.pending, state => {
            //* I'll do nothing, I guess?
        })
        builder.addCase(fetchDetail.fulfilled, (state, action) => {
            state.detailLoaded = {...state.detailLoaded, [action.payload.name]: action.payload};
        })
        builder.addCase(fetchDetail.rejected, (state, action) => {
            console.log('Error loading pokemon detail: ', action.error);
        })
    }
})

export const { increaseOffset, setLoadingNextBatch, removePokemon,
    selectPokemon, deselectPokemon, clearSelection } = pokemonSlice.actions

export default pokemonSlice.reducer