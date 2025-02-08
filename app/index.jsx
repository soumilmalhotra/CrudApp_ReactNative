import { Text, View , TextInput , Pressable, StyleSheet, FlatList} from "react-native";
import {data} from "@/data/todos";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext , useEffect} from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Inter_500Medium , useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";
import  Animated , {LinearTransition}  from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";


export default function Index() {
//in this func we flip the data array and save it in todos array
  const [todos,setTodos] = useState([])

  //in this, we initialize useState on text to make it easier to edit
  const [text, setText] = useState('')

  const {colorScheme, setColorScheme , theme} = useContext(ThemeContext)
  
  const [loaded,error] = useFonts({
    Inter_500Medium,
  })

  useEffect(() => {
    const fetchData = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null 
        if(storageTodos && storageTodos.length){
          setTodos(storageTodos.sort((a,b) => b.id-a.id))
        }
        else {
          setTodos(data.sort((a,b) => b.id - a.id))
        }
      }catch(e){
        console.error(e)
      }
    }
    fetchData()
  }, [data])

  useEffect(() => {
  const storeData = async () => {
    try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
    }catch(e){
      console.error(e)
    }
  }    
  storeData()
  }, [todos])


  if(!loaded && !error){
    return null
  }
  const styles = createStyles(theme,colorScheme)
  const addTodo = () =>{
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text , completed : false}, ... todos])
      setText('')

   }
  }

  const toggelTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo ))
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderItem = ({item}) => (
    <View style = {styles.todoItem}>
        <Text 
        style = {[styles.todoText , item.completed && styles.completedText]}
        onPress={() => toggelTodo(item.id)}
        >{item.title}</Text>
        <Pressable onPress={() => removeTodo(item.id)}>
        <AntDesign name="delete" size={36} color="red" selectable = {undefined} />
        </Pressable>
    </View>
  )
    return (

    <SafeAreaView style = {styles.container}>
      <View style = {styles.inputContainer}>
        <TextInput 
          style = {styles.input}
          placeholder="Add a new Todo Task"
          placeholderTextColor="gray"
          value = {text}
          onChangeText={setText} 
        /> 
        <Pressable onPress={addTodo} style = {styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>  
        </Pressable>       
        <Pressable
        onPress={() => setColorScheme(colorScheme === 'light' ? "dark" : 'light')} style={{marginLeft: 10,}}
        >
          {colorScheme === 'dark' 
          ? <Octicons name ="moon" size={36} color = {theme.text} selectable={undefined}/> 
          : <Octicons name ="sun" size={36} color = {theme.text} selectable={undefined}/>
          }
        </Pressable>
      </View>
      <Animated.FlatList 
      data={todos}
      renderItem={renderItem}
      keyExtractor={todo => todo.id}
      contentContainerStyle = {{flexGrow:1}}
      itemLayoutAnimation={LinearTransition}
      keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
    </SafeAreaView>

  )
}


function createStyles(theme,colorScheme)
 { return StyleSheet.create({
  container:{
    flex :1,
    backgroundColor: theme.background ,
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom : 10,
    padding: 10,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  input: {
    flex : 1,
    borderColor: 'gray',
    borderWidth : 1,
    borderRadius: 5,
    padding : 10,
    marginRight : 10,
    fontSize : 18,
    fontFamily: 'Inter_500Medium',
    minWidth : 0,
    color: theme.text ,
  },
  addButton: {
    backgroundColor: theme.button ,
    padding :10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize : 18,
    color : colorScheme ==='dark'?'dark':'light',
  },
  todoItem : {
    flexDirection: 'row',
    alignItems :'center',
    justifyContent: 'space-between',
    gap: 4,
    padding : 10,
    borderBottomColor:'gray',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  todoText: {
    flex:1,
    fontSize:18,
    fontFamily: 'Inter_500Medium',
    color: theme.text,
  },
  completedText:{
    textDecorationLine: 'line-through',
    color: 'gray',
  }

})

}