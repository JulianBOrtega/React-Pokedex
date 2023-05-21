import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loadingList: false,
    loadingNextBatch: false,
    list: [],
    detailLoaded: [],
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
        removePokemons: (state, action) => {
            action.payload.forEach(targetName => {
                state.list = state.list.filter(pokemon => pokemon.name !== targetName);

                const filteredArray = Object.entries(state.detailLoaded).filter(([key, value]) => key !== targetName);
                state.detailLoaded = Object.fromEntries(filteredArray);
            })
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

export const { increaseOffset, setLoadingNextBatch, removePokemons } = pokemonSlice.actions
export default pokemonSlice.reducer