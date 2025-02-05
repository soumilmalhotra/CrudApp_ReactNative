import { Text, View , TextInput , Pressable, StyleSheet, FlatList} from "react-native";
import {data} from "@/data/todos";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import {Inter_500Medium, useFonts } from "@expo-google-fonts/inter";


export default function Index() {
//in this func we flip the data array and save it in todos array
  const [todos,setTodos] = useState(data.sort((a,b) => b.id - a.id))


  //in this, we initialize useState on text to make it easier to edit
  const [text, setText] = useState('')

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
      </View>
      <FlatList 
      data={todos}
      renderItem={renderItem}
      keyExtractor={todo => todo.id}
      contentContainerStyle = {{flexGrow:1}}
      />


    </SafeAreaView>

  )
}


const styles = StyleSheet.create({
  container:{
    flex :1,
    backgroundColor : 'black',
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
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    padding :10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize : 18,
    color : 'black',
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
    color: 'white',
  },
  completedText:{
    textDecorationLine: 'line-through',
    color: 'gray',
  }

})

