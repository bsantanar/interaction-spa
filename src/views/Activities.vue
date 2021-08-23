<template>
    <v-container style="max-width: 1200px;">
        <h1>
            {{this.$parent.$parent.$parent.language.activities}}
        </h1>
        <div class="text-center" v-if="errored">
            <h3>{{this.$parent.$parent.$parent.language.error}}</h3>
        </div>
        <div v-else>
            <div>
                <v-row>
                    <v-col
                        cols="12"
                        sm="4"
                        md="2"
                    >
                        <div v-if="loading">
                            <v-skeleton-loader
                                class="mx-auto"
                                max-width="300"
                                type="list-item"
                            ></v-skeleton-loader>
                        </div>
                        <v-sheet v-else
                            rounded="lg"
                            elevation="1"
                        >
                            <v-list color="transparent"
                            >
                                <v-subheader>{{this.$parent.$parent.$parent.language.filter}}</v-subheader>
                                <v-list-item-group
                                    v-model="selectedItem"
                                    color="primary"
                                    class="text-center"
                                    >
                                    <v-list-item
                                        v-for="(item, i) in years"
                                        :key="i"
                                    >
                                        <v-list-item-content>
                                        <v-list-item-title v-text="item"></v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-sheet>
                        <v-sheet 
                            class="mt-3"
                                rounded="lg"
                                elevation="1"
                            >
                                <v-list color="transparent"
                                >
                                    <v-subheader>{{this.$parent.$parent.$parent.language.filterCategory}}</v-subheader>
                                    <v-list-item-group
                                        v-model="selectedCategory"
                                        color="primary"
                                        class="text-center"
                                        >
                                        <v-list-item
                                            v-for="(item, i) in categories"
                                            :key="i"
                                        >
                                            <v-list-item-content>
                                            <v-list-item-title v-text="item.name"></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-sheet>
                    </v-col>
                    <v-col
                        cols="12"
                        md="10"
                        sm="8"
                    >
                        <div v-if="loading">
                            <v-skeleton-loader
                                class="mx-auto"
                                type="card"
                            ></v-skeleton-loader>
                        </div>
                            <div v-else
                            >
                            <div
                                v-for="card in filterPublications"
                                :key="card._id">
                                <Activity
                                v-if="showCard(card)"
                                :card="card"
                                />
                            </div>
                            </div>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
import Activity from '@/components/Activity.vue'
import axios from 'axios'
// import moment from 'moment';

export default {
    name: "Activities",
    components: {
        Activity
    },
    data: () => ({
        selectedItem: null,
        selectedCategory: null,
        years: [],
        loading: true,
        errored: false,
        cards: [],
        categories: []
    }),
    mounted() {
        axios
            .get(`${process.env.VUE_APP_API_URL}/activity/`)
            .then(res => {
                this.cards = res.data.data
                this.years = this.cards.map( c => new Date(c.date).getFullYear() )
                                .filter((value, index, self) => self.indexOf(value) === index)
                                .sort((a, b) => b - a)
                this.cards = this.cards.map( r => {
                    return {
                        ...r,
                        image: r.image ? '' + Buffer.from(r.image) : undefined
                    }
                })
                this.categories = this.cards.flatMap(c => c.category)
                            .filter((v, i, a) => 
                            a.findIndex(t =>  t._id === v._id) === i)
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
    computed: {
        filterPublications: function(){
            if(!this.years[this.selectedItem]) return this.cards
            return this.cards.filter(c => new Date(c.date).getFullYear() == this.years[this.selectedItem])
        },
        filterCategories: function(){
            if(typeof this.selectedCategory === 'number') return [this.categories[this.selectedCategory]]
            return true
        }
    },
    methods: {
        showCard(card) {
            if(typeof this.selectedCategory === 'number'){
                let categoryId = this.categories[this.selectedCategory]._id
                console.log(card.category.some(c => c._id == categoryId), categoryId)
                if(card.category.some(c => c._id == categoryId)){
                    return true
                }
                else return false
            }
            return true
        }
    }
}
</script>