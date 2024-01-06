<template>
    <div class="conatiner head">
        <div class="row">
            <div class="col d-flex align-items-center justify-content-center"><img class="fit-image" :src="getPic('left')" /></div>
            <div class="col d-flex align-items-center justify-content-center"><h1 class="m-0 p-0 text-center">{{ choice }}</h1></div>
            <div class="col d-flex align-items-center justify-content-center"><img class="fit-image" :src="getPic('right')" /></div>
        </div>
    </div>
</template>

<script>

    const choices=['Rock','Paper','Scissors'];
    export default {
        name:'header',
        data:()=>({
            index:0
        }),
        computed:{
            choice(){
                return choices[this.index%3]
            },
        },
        methods: {
            getPic(position) {
            return `/header_${position}/0${this.index%3}.png`
            }
        },
        mounted(){
            setInterval(()=>{
                this.index++
            },1000)
        }


    }
</script>

<style lang="css" scoped>
.head{
    background-color: rgb(219, 222, 248);
    height: 15vh;
}
.col{
    height: 15vh;
}
.fit-image{
    max-height: 80%;
}
</style>