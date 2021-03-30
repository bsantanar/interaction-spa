<template>
    <v-card
        class="mx-auto"
        flat
        
    >
    <v-card-subtitle class="pb-0">
        {{card.year}}
    </v-card-subtitle>
    <v-card-title>{{card.title}}</v-card-title>
    <v-card-text class="text--primary">
        <div>{{card.description}}</div>
    </v-card-text>

    <v-card-actions>
        
        <v-list-item class="grow">

            <v-list-item-content>
                <v-list-item-title>{{card.author}}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-card-actions>
<v-divider></v-divider>
    </v-card>
</template>
<script>
  export default {
    name: 'Publication',
    props: ['card'],
    data: () => ({
    })
  }
</script>
