import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { addPokemonFilterAbility } from '../pokemon/pokemonSlice'

const initialState = {
    loadingList: false,
    list: [],
    filteredList: [],
    filter: { content: '' },
    detailLoaded: [],
    error: ''
}

export const fetchAbilities = createAsyncThunk('ability/fetchAbilities', () => {
    return axios.get('https://pokeapi.co/api/v2/ability?limit=100000&offset=0')
    .then(response => response.data.results)
})

export const fetchAbilityDetail = createAsyncThunk('ability/fetchAbilityDetail', (abilityUrl) => {
    return axios.get(abilityUrl)
    .then(response => response.data)
})

const abilitySlice = createSlice({
    name: 'ability',
    initialState,
    reducers: {
        setFilterContent: (state, action) => {
            state.filter = { ...state.filter, content: action.payload };
        },
        setAbilityFilterContent: (state, action) => {
            state.filter = { ...state.filter, content: action.payload };
        },
        clearAbilityFilterList: (state, action) => {
            state.filteredList = null;
        },
        applyAbilityFilter: (state, action) => {
            state.filteredList = state.list.filter(ability => 
                ability.name.toLowerCase().includes(state.filter.content.toLowerCase()));
        }
    },
    extraReducers: builder => {
        //** F E T C H   L I S T *//
        builder.addCase(fetchAbilities.pending, state => {
            state.loadingList = true;
        })
        builder.addCase(fetchAbilities.fulfilled, (state, action) => {
            state.loadingList = false;
            state.list = action.payload;
            state.error = '';
        })
        builder.addCase(fetchAbilities.rejected, (state, action) => {
            state.loadingList = false;
            state.list = [];
            state.error = action.error;
        })

        //** F E T C H   D E T A I L *//
        builder.addCase(fetchAbilityDetail.pending, state => {
            //* I'll do nothing, I guess?
        })
        builder.addCase(fetchAbilityDetail.fulfilled, (state, action) => {
            state.detailLoaded = {...state.detailLoaded, [action.payload.name]: action.payload};
            console.log('DETAIL LOADED FFS')
        })
        builder.addCase(fetchAbilityDetail.rejected, (state, action) => {
            console.log('Error loading pokemon detail: ', action.error);
        })
    }
});

export const addAbilityToPokemonFilter = (ability) => {
    return (dispatch, getState) => {
        dispatch(fetchAbilityDetail(ability.url)).then(() => {
            const detail = getState().ability.detailLoaded[ability.name];
            const pokemons = [];
            detail.pokemon.forEach(element => {
                pokemons.push(element.pokemon.name)
            })

            dispatch(addPokemonFilterAbility({ name: ability.name, pokemons }));
        })
    }
}

export const { setFilterContent, setAbilityFilterContent, clearAbilityFilterList, 
    applyAbilityFilter } = abilitySlice.actions

export default abilitySlice.reducer