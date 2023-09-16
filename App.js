  import React, {useEffect } from 'react';
  import { NavigationContainer } from "@react-navigation/native";
  import { createStackNavigator } from "@react-navigation/stack";
  import { StatusBar } from "expo-status-bar";
  import { s as tw } from "react-native-wind";
  import { auth,dbFirebase ,  firestore, firebase , storage } from "./firebase";
  import { useState } from "react";
  import { View, Text, TextInput, Modal, FlatList,Image, Button ,ActivityIndicator , Alert , Linking, TouchableWithoutFeedback} from "react-native";
  import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import { Feather } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import DateTimePicker from '@react-native-community/datetimepicker';
  import * as ImagePicker from 'expo-image-picker';
  import 'firebase/compat/storage';
  import { StripeProvider } from '@stripe/stripe-react-native';
  import PaymentTwonow from './PaymentTwoNow';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { useFonts } from 'expo-font';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const Stack = createStackNavigator();
  
  





  

 





  


  const PaymentTotalPrice = ({ route }) => {
    const { totalPrice, selectedStartDate, selectedEndDate, orderId } = route.params;
    return (
      <View className="items-center justify-center h-full">
        <Text>Pickup Date: {selectedStartDate}</Text>
        <Text>Return Date: {selectedEndDate}</Text>
        <Text>Total Price: {totalPrice} €</Text>
        <View>
          <StripeProvider publishableKey="pk_live_51NOjnPEcyZZxDJRmC47FCgdYw6ByO4ggyMuZQekzOjFBdsg6ArAsUcSTRFf0ZZzfUJ7lOspHSikJDdZAoFkxggWW00dHNg2rPQ">
            <PaymentTwonow  totalPrice={totalPrice}  selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} orderId={orderId}  />
          </StripeProvider>
        </View>
      </View>
    );
  };








  
   


  const Payment = ({route}) =>{
    const navigation = useNavigation();
    const { item, email, selectedEndDate , selectedStartDate, orderId } = route.params;
    const { pricePerDay } = item;

    const oneDay = 24 * 60 * 60 * 1000;
    const pickupDateObj = new Date(selectedStartDate);
    const returnDateObj = new Date(selectedEndDate);
    const totalDays = Math.round(Math.abs((returnDateObj - pickupDateObj) / oneDay));
    const totalPrice = pricePerDay * totalDays;
    const handleContinue = () => {
      navigation.navigate('Payment Total Price', {
        orderId,
        selectedStartDate: pickupDateObj.toDateString(),
        selectedEndDate: returnDateObj.toDateString(),
        totalPrice,
      });
    };

    return (
      <View style={tw`justify-center w-full h-full p-5`}>
            <Text>Total Price: {totalPrice} €</Text>
            <TouchableOpacity
              onPress={handleContinue}
              style={tw`items-center w-full p-4 mt-4 bg-black rounded-md`}>
              <Text style={tw`text-white`} className="font-custom">
                Continue to Payment
              </Text>
            </TouchableOpacity>
      </View>
    );
  }




  


  const MyCarsScreen = ({ route }) => {
    const { email } = route.params;
    const [userCars, setUserCars] = useState([]);
  
    useEffect(() => {
      const fetchUserCars = async () => {
        try {
          const snapshot = await firestore.collection('carspeople').where('myemail', '==', email).get();
          const userCarsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserCars(userCarsData);
        } catch (error) {
          console.error('Error fetching user cars:', error);
        }
      };
  
      fetchUserCars();
    }, [email]);
  
    const handleDeleteCar = async (carId) => {
      try {
        await firestore.collection('carspeople').doc(carId).delete();
        setUserCars((prevUserCars) => prevUserCars.filter((car) => car.id !== carId));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    };
  
    const handleRequestDeletion = (carName) => {
      const subject = `Car Deletion Request: ${carName}`;
      const body = `Hello,\n\nI am requesting the deletion of my car "${carName}". Please proceed with the deletion process.\n\nBest regards,\n${email}`;
  
      const mailtoLink = `mailto:proerivan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      Linking.openURL(mailtoLink);
    };
  
    return (
      <ScrollView className="h-full p-4 bg-white">
        <View className="mt-12">
        <Text className="mb-2 text-xl font-bold font-customs">Hi {email}</Text>
        <Text className="mb-4 text-lg font-semibold font-customs">List of Your Cars:</Text>
        {userCars.map((car, index) => (
          <View
            key={index}
            className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <Text className="mb-2 text-lg font-semibold text-black font-customs">Car Name: {car.carName}</Text>
            <Text className="mb-1 text-gray-800 font-customs">Car Model: {car.carModel}</Text>
            <Text className="mb-1 text-gray-800 font-customs">State: {car.state}</Text>
            <Text className="mb-1 text-gray-800 font-customs">Country: {car.country}</Text>
            <Text className="mb-1 text-gray-800 font-customs">Address: {car.address}</Text>
            <Text className="mb-2 text-gray-800 font-customs">Price per day: {car.pricePerDay} €</Text>
  
            {/* Assuming carPhotos is an array of photo URLs, you can display them as follows */}
            <View className="flex flex-row mb-2 space-x-2">
              {car.carPhotos.map((photoUrl, photoIndex) => (
                <Image  
                  key={photoIndex}
                  source={{ uri: photoUrl }}
                  style={{ width: '100%', height: 200, borderRadius: 8 }}
                />
              ))}
            </View>
  

            <TouchableOpacity
              onPress={() => handleRequestDeletion(car.carName)}
              className="items-center px-4 py-3 bg-blue-500 rounded-full"
            >
              <Text className="font-semibold text-white font-customs">Request deletion</Text>
            </TouchableOpacity>
          </View>
        ))}
        </View>
       
      </ScrollView>
    );
  };








    


 



   
  
  
   





 




   



  

  const BookingSecondScreen = ({route})=>{
    
  const navigation = useNavigation();
  const { item, email, selectedEndDate, selectedStartDate } = route.params;
  const [address, setAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [mobilePhoneInsurance, setMobilePhoneInsurance] = useState('');
  const [idCard, setIdCard] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  // Function to handle ID Card image selection
        useEffect(() => {
          // Request permission to access the device's camera roll
          (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }
          })();
        }, []);


        const handleIdCardPicker = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setIdCard(result.assets[0].uri); // Use assets[0] to get the selected asset
          }
        };

          const handleDriverLicensePicker = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setDriverLicense(result.assets[0].uri); 
            }
          };

  


                const handleContinue = async () => {
                  if (!address || !emailAddress || !mobileNumber || !fullName || !insuranceName || !mobilePhoneInsurance) {
                    alert('Please fill in all the required fields.');
                    setIsLoading(false);  
                    return;
                  }
                  try {
                    setIsLoading(true); 
              
            
                  const idCardBlob = await fetch(idCard).then((res) => res.blob());
                  const idCardRef = storage.ref().child(`id_cardsusers/${email}`);
                  await idCardRef.put(idCardBlob);
              
                  const driverLicenseBlob = await fetch(driverLicense).then((res) => res.blob());
                  const driverLicenseRef = storage.ref().child(`driver_licensesusers/${email}`);
                  await driverLicenseRef.put(driverLicenseBlob);
              
                  // Get the download URLs for the images
                  const idCardUrl = await idCardRef.getDownloadURL();
                  const driverLicenseUrl = await driverLicenseRef.getDownloadURL();
            // Add booking data to Firebase Firestore collection "orders"
                    const docRef = await dbFirebase.collection('orders').add({
                      email,
                      item,
                      selectedEndDate,
                      selectedStartDate,
                      idCard: idCardUrl,
                      driverLicense: driverLicenseUrl,
                      insurance: insuranceName,
                      address,
                      mobileNumber,
                      fullName,
                      insuranceNumber: '',
                      mobilePhoneInsurance,
                    });
        
            const orderId = docRef.id;
            navigation.navigate('Payment final', {
              email,
              orderId,
              item,
              selectedEndDate: selectedEndDate.toDateString(),
              selectedStartDate: selectedStartDate.toDateString(),
            });
          } catch (error) {
            console.error('Error uploading images or adding data to Firestore:', error);
            alert('An error occurred. Please try again later.');
          }
    };
  

      return(
        <View style={tw`justify-center h-full p-4 bg-white`}>
          
         <View className="items-center text-3xl">
          <Text className="mb-4 text-3xl text-black font-customs">
            Step 2...
          </Text>
        </View>

        <TextInput
        className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Your Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />

      
        <TextInput
          className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Email Address"
          value={emailAddress}
          onChangeText={(text) => setEmailAddress(text)}
        />

        
        <TextInput
        className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Mobile Phone Number"
          value={mobileNumber}
          onChangeText={(text) => setMobileNumber(text)}
        />

      
        <TextInput

  className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500" 
    placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />

      
        <TextInput
    className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
      placeholder="Insurance Name"
          value={insuranceName}
          onChangeText={(text) => setInsuranceName(text)}
        />

        
        <TextInput
   className="border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
    placeholder="Mobile Phone Insurance"
          value={mobilePhoneInsurance}
          onChangeText={(text) => setMobilePhoneInsurance(text)}
        />

      
        <TouchableOpacity onPress={handleIdCardPicker } style={tw`w-full p-2 mb-4 border border-gray-400 font-customs`}>
          <Text>Select ID Card Image</Text>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={handleDriverLicensePicker} style={tw`w-full p-2 mb-4 border border-gray-400 font-customs`} >
          <Text>Select Driver's License Image</Text>
        </TouchableOpacity>

        


        <TouchableOpacity className="items-center w-full p-4 mt-4 bg-black rounded-full font-customs" onPress={handleContinue}>
        {isLoading ? ( // Show loading spinner when isLoading is true
          <ActivityIndicator color="black" />
        ) : (
          <Text className="font-bold text-center text-white font-customs">Continue</Text>
        )}
      </TouchableOpacity>
      </View>
      );
    };

  

    
   
  
  
   
   
    

    
  


  
  
  
    

    
  

    const HomesScreen = ({route}) => {
      const { email } = route.params;
      const [carsPeople, setCarsPeople] = useState([]);
      const [searchInput, setSearchInput] = useState('');
      const [filteredCarsPeople, setFilteredCarsPeople] = useState([]);
      const navigation = useNavigation();
   
     const handle=()=>{
        navigation.navigate('AskkeyNowScreen',{email});
     }
     
      const navigateToDetails = (item) => {
        navigation.navigate('Details', { item, email });
      };
    
      useEffect(() => {
        // Retrieve data from Firestore collection
        const unsubscribe = dbFirebase.collection('carspeople').onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCarsPeople(data);
          setFilteredCarsPeople(data); // Initialize filtered data with all items
        });
        return () => unsubscribe();
      }, []);
    
      const handleSearch = (query) => {
        // Filter the carsPeople list based on the search query
        const filteredData = carsPeople.filter((item) =>
          item.city.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCarsPeople(filteredData);
      };

      return (
       
        <View style={tw`h-full p-4 bg-white `}>
         
         
         
          
        <View style={tw`mt-12`}>
         
      
         
           
          <View className="bg-[#F4F5FA] rounded-md  mt-2 flex">
        
         
          <View className="flex flex-row py-2 pl-5">
          <Feather name="search" color={'gray'} size={22} className="" />
            <TextInput
              className="bg-[#F4F5FA] outline-none flex-grow ml-4 font-customs"
              placeholder="Search by city"
              onChangeText={(text) => {
                setSearchInput(text);
                handleSearch(text);
              }}
              value={searchInput}
            />
          </View>
  </View>
          <FlatList
            data={filteredCarsPeople}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToDetails(item)}>
                {/* Wrap the item content in TouchableOpacity */}
                <View style={tw`p-4 my-4 mb-12 bg-white border rounded-lg shadow shadow-2xl border-gray-50`}>
                  <View style={tw`flex-row items-center`}>
                    <Image source={{ uri: item.profilePicture }} style={tw`w-8 h-8 mr-4 rounded-full`} />
                    <View>
                      <Text style={tw`text-lg font-semibold`} className="font-customs">{item.name}</Text>
                      <Text style={tw`text-sm text-gray-500`} className="font-customs">
                        {item.country}, {item.city}
                      </Text>
                    </View>
                  </View>
                  <Text style={tw`p-2 mt-2 text-sm`} className="font-customs">
                    {item.carName}, {item.carModel}
                  </Text>
                  <Image source={{ uri: item.carPhotos[0] }} style={tw`w-full mr-4 rounded-md h-52`} />
                  <Text style={tw`mt-2 font-bold`} className="text-gray-500 font-customs">Price per day: {item.pricePerDay} €</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

       

          
      </View>
      );
    };



     

    
    


    


   




  









  

  

  

  const DetailsScreen = ({route})=>{
    const { item ,email } = route.params;
    const navigation = useNavigation();
  
    const navigateToBookingScreen = () => {
      navigation.navigate('Rent first', { item, email });
    };

    const navigateToBookingDeuxScreen = () => {
      navigation.navigate('Chat', {email });
    };






    return (
      <ScrollView style={tw`flex-1 px-4 bg-white`}>
      <View style={tw`h-full bg-white`}>
        <View style={tw`mt-12`}>
          
          <View style={tw`flex flex-row mt-4 `}>
            <Image source={{ uri: item.profilePicture }} style={tw`w-8 h-8 mb-4 mr-4 rounded-full`} />
            <Text style={tw`mt-2`}>{item.name}</Text>
          </View>
    
          
    
          <Image source={{ uri: item.carPhotos[0] }} style={tw`w-full mt-4 mb-4 rounded-md h-60`} />
          <Text style={tw`p-5 `} className="font-customs text-slate-600">
            Rent the {item.carName}  and explore the roads with confidence. This sleek and stylish car comes with a range of features including {item.includedFeatures} . It has traveled {item.kilometersUsed}  kilometers and is ready to be your perfect companion in {item.city} , {item.country} . Rest assured with comprehensive insurance coverage and reach out to us at {item.phoneNumber} to start your exciting journey now!
          </Text>



          <TouchableOpacity onPress={navigateToBookingScreen} style={tw`w-full py-4 mb-4 bg-black rounded-full`}>
            <Text className="font-bold text-center text-white font-customs">
              Book the car
            </Text>
          </TouchableOpacity>

          <View style={tw`items-center mb-4`}>
               <Text>Or</Text>
          </View>

          <TouchableOpacity onPress={navigateToBookingDeuxScreen } style={tw`w-full py-4 mb-4 bg-gray-200 rounded-full`} >
            <Text className="font-bold text-center text-gray-700 font-customs">
              Send a message
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    );
  }


   
    








    
 


    
  


 








  const RentScreen =({route})=>{
    const navigation = useNavigation();
    const { item, email } = route.params;
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleStartDateChange = (event, selectedDate) => {
      setShowStartDatePicker(false);
      if (selectedDate) {
        setSelectedStartDate(selectedDate);
      }
    };

    const handleEndDateChange = (event, selectedDate) => {
      setShowEndDatePicker(false);
      if (selectedDate) {
        setSelectedEndDate(selectedDate);
      }
    };


    const navigateToBookingScreen = () => {
        navigation.navigate('Rent Second', {
          item,
          email,
          selectedStartDate,
          selectedEndDate,
        });
      };





    return (
      <View className="flex justify-center w-full h-full p-5 my-auto bg-white">
        <View className="items-center text-3xl">
          <Text className="mb-4 text-3xl text-black font-customs">
            Select your Date
          </Text>
        </View>

      <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className="mb-4 rounded-full">
        <Text className="p-5 text-black bg-gray-100">Select Start Date</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          className="p-5 bg-black"
          value={selectedStartDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
    
      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)} className="mb-4">
        <Text className="p-5 text-black bg-gray-100 rounded-full">Select End Date</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={selectedEndDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
  
  <TouchableOpacity className="items-center py-4 bg-black rounded-full" onPress={navigateToBookingScreen}>
    <Text className="text-white font-custom">
    Continue
    </Text>
 
     </TouchableOpacity>
     
    </View>
    )
  }



  const FourStepaddcar = ({route})=>{
    const { allData } = route.params;
  const { formData, additionalData } = allData;
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const navigation = useNavigation();

  const {
    myemail,
    pricePerDay,
    carName,
    carModel,
    assuranceName,
    assuranceNumber,
    includedFeatures,
  } = formData;

  const {
    name,
    phoneNumber,
    address,
    country,
    city,
    state,
    insurance,
    iban,
    swiftCode,
    kilometersUsed,
  } = additionalData;

  const [carPhotos, setCarPhotos] = useState([]); // Holds the car photos
  const [licensePhoto, setLicensePhoto] = useState(''); // Holds the license photo
  const [profilePicture, setProfilePicture] = useState(''); // Holds the profile picture

  const storeFormData = async (data) => {
    try {
      // Store the form data in AsyncStorage
      await AsyncStorage.setItem('formData', JSON.stringify(data));
    } catch (error) {
      console.log('Error storing form data:', error);
    }
  };

  const retrieveFormData = async () => {
    try {
      // Retrieve the form data from AsyncStorage
      const data = await AsyncStorage.getItem('formData');
      if (data !== null) {
        // If the data exists, parse it and set the state variables
        const parsedData = JSON.parse(data);
        setCarPhotos(parsedData.carPhotos);
        setLicensePhoto(parsedData.licensePhoto);
        setProfilePicture(parsedData.profilePicture);
      }
    } catch (error) {
      console.log('Error retrieving form data:', error);
    }
  };

  const storeImageURLs = async (carPhotoUrls, licensePhotoUrl, profilePictureUrl) => {
    try {
      // Store car photo URLs in AsyncStorage
      await AsyncStorage.setItem('carPhotos', JSON.stringify(carPhotoUrls));
      // Store license photo URL in AsyncStorage
      await AsyncStorage.setItem('licensePhoto', licensePhotoUrl);
      // Store profile picture URL in AsyncStorage
      await AsyncStorage.setItem('profilePicture', profilePictureUrl);
    } catch (error) {
      console.log('Error storing image URLs:', error);
    }
  };

  const retrieveImageURLs = async () => {
    try {
      // Retrieve car photos, license photo, and profile picture URLs from AsyncStorage
      const carPhotos = await AsyncStorage.getItem('carPhotos');
      const licensePhoto = await AsyncStorage.getItem('licensePhoto');
      const profilePicture = await AsyncStorage.getItem('profilePicture');

      if (carPhotos !== null && licensePhoto !== null && profilePicture !== null) {
        // If the URLs exist, parse the car photos and set the state variables
        const parsedCarPhotos = JSON.parse(carPhotos);
        setCarPhotos(parsedCarPhotos);
        setLicensePhoto(licensePhoto);
        setProfilePicture(profilePicture);
      }
    } catch (error) {
      console.log('Error retrieving image URLs:', error);
    }
  };

  useEffect(() => {
    retrieveFormData();
    retrieveImageURLs();
  }, []);

  const handleCarPhotoUpload = async () => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library was denied');
        return;
      }

      // Allow the user to pick car photos using ImagePicker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Set the selected car photos in the state
        const selectedPhotos = result.assets.map((asset) => asset.uri);
        setCarPhotos(selectedPhotos);
      }
    } catch (error) {
      console.log('Error picking car photos:', error);
    }
  };

  const handleLicensePhotoUpload = async () => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library was denied');
        return;
      }

      // Allow the user to pick a license photo using ImagePicker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.uri) {
        // Set the selected license photo in the state
        setLicensePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking license photo:', error);
    }
  };

  const handleProfilePictureUpload = async () => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library was denied');
        return;
      }

      // Allow the user to pick a profile picture using ImagePicker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.uri) {
        // Set the selected profile picture in the state
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking profile picture:', error);
    }
  };

  const handleSubmit = async () => {
    if (carPhotos.length === 0 || !licensePhoto || !profilePicture) {
      Alert.alert('Validation Error', 'Please upload all required photos.');
      return;
    }
  
    try {
      // Check if a person with the same name, phone number, and car name already exists
      const existingBooking = await firestore.collection('carspeople')
        .where('name', '==', name)
        .where('phoneNumber', '==', phoneNumber)
        .where('carName', '==', carName)
        .get();
  
      if (!existingBooking.empty) {
        Alert.alert('Duplicate Entry', 'A person with the same name, phone number, and car name already exists.');
        return;
      }
  
      // Upload car photos to Firebase Storage
      const carPhotoUrls = await Promise.all(
        carPhotos.map(async (photo, index) => {
          const response = await fetch(photo);
          const blob = await response.blob();
          const photoRef = storage.ref(`carPhotos/${carName}_${index}.png`);
          await photoRef.put(blob, { contentType: 'image/png' });
          const downloadURL = await photoRef.getDownloadURL();
          return downloadURL;
        })
      );
  
      // Upload license photo to Firebase Storage
      const licensePhotoResponse = await fetch(licensePhoto);
      const licensePhotoBlob = await licensePhotoResponse.blob();
      const licensePhotoRef = storage.ref(`licensePhoto/${carName}_license.png`);
      await licensePhotoRef.put(licensePhotoBlob, { contentType: 'image/png' });
      const licensePhotoUrl = await licensePhotoRef.getDownloadURL();
  
      // Upload profile picture to Firebase Storage
      const profilePictureResponse = await fetch(profilePicture);
      const profilePictureBlob = await profilePictureResponse.blob();
      const profilePictureRef = storage.ref(`profilePicture/${carName}_profile.png`);
      await profilePictureRef.put(profilePictureBlob, { contentType: 'image/png' });
      const profilePictureUrl = await profilePictureRef.getDownloadURL();
  
      // Store the form data in booking data
      const bookingData = {
        myemail,
        pricePerDay,
        carName,
        carModel,
        assuranceName,
        assuranceNumber,
        includedFeatures,
        name,
        phoneNumber,
        address,
        country,
        city,
        state,
        insurance,
        iban,
        swiftCode,
        kilometersUsed,
        carPhotos: carPhotoUrls,
        licensePhoto: licensePhotoUrl,
        profilePicture: profilePictureUrl,
      };
  
      await firestore.collection('carspeople').add(bookingData);
      console.log('Booking added to Firestore');
      

      // Store the form data in AsyncStorage
      await storeFormData({
        carPhotos: carPhotoUrls,
        licensePhoto: licensePhotoUrl,
        profilePicture: profilePictureUrl,
      });
  
      const updatedAllData = {
        ...allData,
        additionalData: {
          ...additionalData,
          carPhotos: carPhotoUrls,
          licensePhoto: licensePhotoUrl,
          profilePicture: profilePictureUrl,
        },
      };
      setIsLoading(true);
      navigation.navigate('Home', { allData: updatedAllData });
    } catch (error) {
      console.error('Error adding booking to Firestore:', error);
    }finally {
      setIsLoading(false); // Hide loading spinner after submission or error
    }
  };

    return(
      <ScrollView style={{ backgroundColor: 'white', }}>
      <View style={{ backgroundColor: 'white', padding: 16 }}>
        <View>
          <Text style={{ fontFamily: 'font-customs', fontSize: 24, marginBottom: 16 }}>Booking Fourth Step </Text>
        </View>

        <TouchableOpacity onPress={handleCarPhotoUpload} style={{ backgroundColor: 'black', padding: 16, borderRadius: 30, marginBottom: 20 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'font-customs' }}>Select Car Photos</Text>
        </TouchableOpacity>

        {carPhotos.map((photo, index) => (
          <View key={index}>
            <Text>Car Photo {index + 1}</Text>
            <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />
          </View>
        ))}

        <TouchableOpacity onPress={handleLicensePhotoUpload} style={{ backgroundColor: 'black', padding: 16, borderRadius: 30, marginBottom: 20 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'font-customs' }}>Select License Photo</Text>
        </TouchableOpacity>

        {licensePhoto && (
          <View>
            <Text>License Photo</Text>
            <Image source={{ uri: licensePhoto }} style={{ width: 200, height: 200 }} />
          </View>
        )}

        <TouchableOpacity onPress={handleProfilePictureUpload} style={{ backgroundColor: 'black', padding: 16, borderRadius: 30 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'font-customs' }}>Select Profile Picture</Text>
        </TouchableOpacity>

        {profilePicture && (
          <View>
            <Text>Profile Picture</Text>
            <Image source={{ uri: profilePicture }} style={{ width: 200, height: 200 }} />
          </View>
        )}
        
        <Text className="mt-2 mb-4 text-2xl text-black">
          Wait 30 second after submit , this may take a little to submit...
        </Text>

        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading || carPhotos.length === 0 || !licensePhoto || !profilePicture}
          style={{
            backgroundColor: isLoading || carPhotos.length === 0 || !licensePhoto || !profilePicture ? 'gray' : 'black',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          {isLoading ? ( // Show loading spinner when isLoading is true
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Submit</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
    );
  }



  const ThirdStepaddcar=({route})=>{
    const { allData  } = route.params;
    const { formData, additionalData} = allData;
    const navigation = useNavigation();


    const [kilometersUsed, setKilometersUsed] = useState('');


    const handleSubmit = () => {
      // Check if any field is empty
      if (kilometersUsed.trim() === '') {
        // Display an error message or perform any desired action
        alert('Please fill in all the fields');
        return;
      }
  
      const allDataWithKilometers = {
        formData,
        additionalData: {
          ...additionalData,
          kilometersUsed,
        },
      };
  
      navigation.navigate('Four Step add car', { allData: allDataWithKilometers });
    };

    return(
      <View>
           <View style={tw`justify-center h-full p-4 bg-white`}>
      <View>
        <Text style={tw`mb-4 text-2xl font-customs`}>Booking Third Step </Text>
      </View>

      <TextInput
        style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
        placeholder="Kilometers used"
        value={kilometersUsed}
        onChangeText={(text) => setKilometersUsed(text)}
      />

      <TouchableOpacity onPress={handleSubmit} style={tw`p-4 text-white bg-black rounded-full font-customs`}>
        <Text style={tw`text-center text-white font-customs`} >Continue</Text>
      </TouchableOpacity>
    </View>
      </View>
    );
  }

const SecondStepaddcar = ({route})=>{
  const navigation = useNavigation();
  const { formData  } = route.params;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [insurance, setInsurance] = useState('');
  const [iban, setIban] = useState(''); // New state for IBAN
  const [swiftCode, setSwiftCode] = useState(''); //


  const handleSubmit = () => {
    if (
      name.trim() === '' ||
      phoneNumber.trim() === '' ||
      address.trim() === '' ||
      country.trim() === '' ||
      city.trim() === '' ||
      state.trim() === '' ||
      insurance.trim() === '' ||
      iban.trim() === '' ||
      swiftCode.trim() === ''
    ) {
      // Display an error message or perform any desired action
      alert('Please fill in all the fields');
      return;
    }



    const additionalData = {
      name,
      phoneNumber,
      address,
      country,
      city,
      state,
      insurance,
      iban, // Include IBAN in the additional data
      swiftCode, // Include SWIFT/BIC Code in the additional data
    };

    const allData = {
      formData,
      additionalData,
    };

    
    navigation.navigate('Third Step add car', { allData });
  };
  return (
    <View style={tw`justify-center h-full p-4 bg-white`}>
    <View>
      <Text style={tw`mb-4 text-2xl font-customs`}>Please provide your information</Text>
    </View>
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="Please ensure that you use the same name when signing up"
      value={name}
      onChangeText={(text) => setName(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="Phone number"
      value={phoneNumber}
      onChangeText={(text) => setPhoneNumber(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="Address"
      value={address}
      onChangeText={(text) => setAddress(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="Country"
      value={country}
      onChangeText={(text) => setCountry(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="City"
      value={city}
      onChangeText={(text) => setCity(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="State"
      value={state}
      onChangeText={(text) => setState(text)}
    />
    <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="Insurance"
      value={insurance}
      onChangeText={(text) => setInsurance(text)}
    />
    <Text className="mt-4 mb-4 text-xl font-customs"> Your bank information</Text>
      <TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="International Bank account number "
      onChangeText={(text) => setIban(text)}
      value={iban}
    />
  

<TextInput
      style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
      placeholder="SWIFT / BIC CODE "
      value={swiftCode}
      onChangeText={(text) => setSwiftCode(text)}
    />
      <View style={tw`mb-4`}></View>

    <TouchableOpacity onPress={handleSubmit} style={tw`p-4 text-white bg-black rounded-full font-customs`}>
      <Text style={tw`text-center text-white font-customs`}>Submit</Text>
    </TouchableOpacity>
  </View>
  );
}

  const PublishCarNow = ({route})=>{
    const navigation = useNavigation();
    const {email} = route.params;
    const [myemail, setmyemail] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [carName, setCarName] = useState('');
    const [carModel, setCarModel] = useState('');
    const [assuranceName, setAssuranceName] = useState('');
    const [assuranceNumber, setAssuranceNumber] = useState('');
    const [includedFeatures, setIncludedFeatures] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    

    const handleSubmit = () => {
      // Check if any field is empty
      if (
        myemail.trim() === '' ||
        pricePerDay.trim() === '' ||
        carName.trim() === '' ||
        carModel.trim() === '' ||
        assuranceName.trim() === '' ||
        assuranceNumber.trim() === '' ||
        includedFeatures.trim() === ''
      ) {
        // Display an error message or perform any desired action
        alert('Please fill in all the fields');
        return;
      }
      if (myemail !== email) {
        alert('Email does not match');
        return;
      }
  
      const formData = {
        myemail,
        pricePerDay,
        carName,
        carModel,
        assuranceName,
        assuranceNumber,
        includedFeatures,
      };
  
      setIsLoading(true); // Show loading spinner while submitting
  
      // Simulate some asynchronous operation, like an API call
      setTimeout(() => {
        setIsLoading(false); // Hide loading spinner
        navigation.navigate('Second Step add car', { formData });
      }, 2000); // Simulate a 2-second delay
    };
  
    return(
      <View style={tw`justify-center w-full h-full p-5 mt-12 bg-white`}>
        <Text style={tw`pb-4 `} className="font-customs">Hello , {email}</Text>
          <TextInput
          className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500`}
        placeholder="Insert the email beside hello, "
        value={myemail}
        onChangeText={(text) => setmyemail(text)}
      />

<TextInput
     className=" font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500 font-customs`}
        placeholder="Price per day in €"
        value={pricePerDay}
        onChangeText={(text) => setPricePerDay(text)}
      />


<TextInput
className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  font-customs p-2 mb-2 rounded-md focus:outline-none focus:border-blue-500 `}
        placeholder="Car name"
        value={carName}
        onChangeText={(text) => setCarName(text)}
      />





<TextInput
className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500 `}
        placeholder="Car model"
        value={carModel}
        onChangeText={(text) => setCarModel(text)}
      />


<TextInput
className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500 `}
        placeholder="Assurance Name"
        value={assuranceName}
        onChangeText={(text) => setAssuranceName(text)}
      />


<TextInput
className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  p-2 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
        placeholder="Assurance Number"
        value={assuranceNumber}
        onChangeText={(text) => setAssuranceNumber(text)}
      />


<TextInput
className="font-customs"
        style={tw`border border-gray-400 bg-[#F5F8FA]  p-6 font-customs mb-2 rounded-md focus:outline-none focus:border-blue-500`}
        placeholder="Included features GPS etc"
        value={includedFeatures}
        onChangeText={(text) => setIncludedFeatures(text)}
      />


<TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: 'black',
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 25,
          marginTop: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? (
          <ActivityIndicator color="white" /> // Show loading spinner
        ) : (
          <Text style={{ color: 'white'}}>Continue</Text>
        )}
      </TouchableOpacity>

      </View>
    )
  }

  










  


const AskkeyNowScreen = ({route})=>{
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Request permission to access the device's camera roll
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const handleIdCardPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIdCard(result.assets[0].uri); // Use assets[0] to get the selected asset
    }
  };

  const handleDriverLicensePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDriverLicense(result.assets[0].uri); // Use assets[0] to get the selected asset
    }
  };

  

 
  const handleSubmission = async () => {
    if (!email || !idCard || !driverLicense) {
      alert('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
  
    try {
      // Check if the email already exists in the collection
      const snapshot = await firestore.collection('keys').where('email', '==', email).get();
      if (!snapshot.empty) {
        alert('Email already exists. Please use a different email.');
        setIsSubmitting(false);
        return;
      }
  
      // Upload images to Firebase Storage
      const idCardBlob = await fetch(idCard).then((res) => res.blob());
      const idCardRef = storage.ref().child(`id_cards/${email}`);
      await idCardRef.put(idCardBlob);
  
      const driverLicenseBlob = await fetch(driverLicense).then((res) => res.blob());
      const driverLicenseRef = storage.ref().child(`driver_licenses/${email}`);
      await driverLicenseRef.put(driverLicenseBlob);
  
      // Get the download URLs for the images
      const idCardUrl = await idCardRef.getDownloadURL();
      const driverLicenseUrl = await driverLicenseRef.getDownloadURL();
  
      // Insert user data into the Firebase Firestore collection
      await firestore.collection('askkey').add({
        email,
        idCard: idCardUrl,
        driverLicense: driverLicenseUrl,
      });
  
      alert('Your key has been requested');
    } catch (error) {
      console.error('Error adding user data:', error);
      alert('An error occurred while adding user data. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  









  


  


  return(
    <View  style={tw`justify-center w-full h-full bg-white`}>
     
      <View style={tw`mx-4 mt-5 bg-white`}>
      
        <Text className="text-3xl mb-14 font-custom">
            Ask your key and publish your car
        </Text>

        
        <Text  style={tw`font-customs`}>Email</Text>
        <TextInput
        style={tw`px-3 py-2 mt-1 normal-case border border-gray-300 rounded`}
          value={email}
          onChangeText={setEmail}
        />

        <Text>ID card</Text>
        <TouchableOpacity onPress={handleIdCardPicker}>
          <View style={tw`px-3 py-2 mt-1 border border-gray-300 rounded`} >
            {idCard ? (
              <Image source={{ uri: idCard }} style={{ width: 100, height: 100 }} />
            ) : (
              <Text style={tw`font-custom`}>Choose ID Card</Text>
            )}
          </View>
        </TouchableOpacity>

        <Text>Driver License:</Text>
        <TouchableOpacity onPress={handleDriverLicensePicker}>
          <View style={tw`px-3 py-2 mt-1 border border-gray-300 rounded`} >
            {driverLicense ? (
              <Image source={{ uri: driverLicense }} style={{ width: 200, height: 150 }} />
            ) : (
              <Text style={tw`font-custom`}>Choose Driver License</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmission} style={tw`items-center px-4 py-4 mt-3 bg-black rounded-md`} >
          <Text style={tw`text-white font-customs`} className="font-customs">Send the documents</Text>
        </TouchableOpacity>
      </View> 

      {isSubmitting && (
        <View style={tw`absolute top-0 bottom-0 left-0 right-0 items-center justify-center bg-black bg-opacity-50`} >
          <ActivityIndicator size="large" color="white" />
          <Text style={tw`mt-2 text-lg font-bold text-white`}>Submitting...</Text>
        </View>
      )}


    </View>
  )
}





  const AskkeyScreen = ({route}) => {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [picture, setPicture] = useState("");
    const [date, setDate] = useState("");
    const [content, setContent] = useState("");
    const navigation = useNavigation();
    const {email} = route.params;



   const handleKey = ()=>{
    navigation.navigate("AskkeyNowScreen", { email });
   }
   


   
   const handlePublishCar = () =>{
    navigation.navigate("CarAsk", { email });
   }

    return (
      <View style={tw`justify-center h-full bg-white dark:bg-gray-900`}>
        <View
          style={tw`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0`}
        >
          <View  className="inline-flex px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  <Text className="text-xl font-medium text-green-700">
                    Rent your car
                  </Text>
                </View>
          <View
            style={tw`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-70`}
          >
            <View style={tw`p-6 space-y-4 md:space-y-6 sm:p-8`}>
              
              <View>
              <Text className="mb-2 text-4xl text-black font-customs">
                Get your key and publish your car
          </Text>
              </View>

              <Text className="mb-6 text-left text-black text-md font-customs">
            Monetize your idle car and provide a valuable service by renting it out, earning extra income in the process.
          </Text>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlbnQlMjBjYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' }}
            style={{ width: 300, height: 200 }}
            className="my-6 rounded-lg"
          />


              <TouchableOpacity
                style={tw`items-center px-5 py-4 mt-4 bg-gray-100 rounded-md hover:bg-gray-600`}
                onPress={handlePublishCar}
              >
                <Text style={tw`text-sm font-medium `} className="text-black font-customs">Publish a car</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={tw`items-center px-5 py-4 mt-4 bg-black rounded-md hover:bg-blue-600`}
                onPress={handleKey}
              >
                <Text style={tw`text-sm font-medium text-white`} className="font-customs">Ask for a key</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };



  



  

  const CarAsk = ({ route }) => {
    const { email } = route.params;
    const navigation = useNavigation();
    const [keyPasswordInput, setKeyPasswordInput] = useState('');
    const [isValidKey, setIsValidKey] = useState(true); // Set the initial state as true
  
    const handleVerifyKey = () => {
      dbFirebase
        .collection('keys')
        .where('keyPassword', '==', keyPasswordInput)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            setIsValidKey(false);
          } else {
            setIsValidKey(true);
            navigation.navigate('Publishcar', { email });
          }
        })
        .catch((error) => {
          console.log('Error verifying key password:', error);
        });
    };
  
    return (
      <View className="items-center justify-center h-full p-5 bg-black">
        
      <View className="items-center">
      <Image source={require('./assets/logoandroid.png')}  className="items-center w-12 h-12 mb-12" />
        <Text className="mb-4 text-2xl text-center text-white align-middle font-customs">
         Insert your key 
        </Text>
      </View>
        <TextInput
        style={tw`bg-black mb-4 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}

          placeholder="Enter Key"
          value={keyPasswordInput}
          onChangeText={(text) => setKeyPasswordInput(text)}
        />
        <Button title="Verify Key" className="" onPress={handleVerifyKey} />
    
        {!isValidKey && <Text style={{ color: 'red' }}>Invalid Key , verify uppercase letters or wrong data</Text>}
       
       
      </View>
    );
  };



  
  

  














  















 







  
  

const ChatScreen = ({route})=>{
  const { email } = route.params;
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await firestore.collection('users').get();
      const usersData = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersData.filter(user => user.email !== email));
    };

    fetchUsers();
  }, [email]);
 

  const handleChatPress = (user) => {
    navigation.navigate('Chatroom', {
      currentUser: { email }, // Pass the current user object with email
      chatUser: { email: user.email, name: user.name, profileImage: user.profileImage }
    });
  };

  const filteredUsers = searchQuery
    ? users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

    
  return(
    <View className="flex-1 h-full p-4 bg-white">
    <TextInput
      className="bg-[#F6F6F6] rounded-full border-[#F6F6F6] font-customs mt-12"
      style={{ height: 40, padding: 10, marginBottom: 10 }}
      placeholder="Search users by name.."
      value={searchQuery}
      onChangeText={setSearchQuery}
    />

    {searchQuery && filteredUsers.length === 0 ? (
      <Text>No users found</Text>
    ) : (
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <View className="flex-row items-center p-4 border-b border-gray-200">
              <Image
                source={{ uri: item.profileImage }}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
              />
              <Text className="text-lg font-medium">{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    )}
  </View>
  );
}


const ChatRoomScreen = ({route}) =>{
  const { currentUser, email, chatUser } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();


  const back =()=>{
    navigation.navigate('Home', { email }); 
   
  }


  useEffect(() => {
    const chatId = generateChatId(currentUser.email, chatUser.email);

    const unsubscribe = firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      });

    return () => unsubscribe();
  }, [currentUser.email, chatUser.email]);

  const generateChatId = (user1Email, user2Email) => {
    const sortedEmails = [user1Email, user2Email].sort(); 
    return `${sortedEmails[0]}_${sortedEmails[1]}`;
  };

  const sendMessage = () => {
    const chatId = generateChatId(currentUser.email, chatUser.email);

    firestore.collection('chats').doc(chatId).collection('messages').add({
      sender: currentUser.email,
      receiver: chatUser.email,
      message: message,
      timestamp: new Date(),
    });
    setMessage('');
  };


  const renderItem = ({ item }) => {
    const isSender = item.sender === currentUser.email;
    return (
      <View className={`p-2 ${isSender ? 'bg-[#703DFE] self-end' : 'bg-gray-200 self-start'} rounded-md my-1 mx-1`}>
        <Text className={`text-${isSender ? 'white' : 'black'} font-customs `}>{item.message}</Text>
        <Text className={`text-${isSender ? 'white' : 'black'} text-sm font-customs self-end`}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getHours()}:${date.getMinutes()}`;
  };
 

  return(
    <View className="flex-1 bg-white">
      <View className="flex-row items-start justify-start p-4 mt-12 bg-white">
        <Image
          source={{ uri: chatUser.profileImage }}
          style={{ width: 33, height: 33, borderRadius: 50 }}
        />
        <Text className="pl-4 text-xl font-bold text-center">{chatUser.name}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <View className="flex-row items-center p-4 mb-4 bg-white">
        <TextInput
          className="flex-1 p-4 mr-4 text-black bg-gray-100 rounded-full font-customs"
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message here"
        />
          <TouchableOpacity
          className="bg-[#703DFE] px-4 py-2 rounded-full"
          onPress={sendMessage}
          disabled={!message.trim()}
        >
            <Ionicons name="send-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  

}




const HelpCenter=({route})=>{
  const {email} = route.params;
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState([]); 
  const [filteredFaqs, setFilteredFaqs] = useState([]); // Holds the filtered FAQ data
  const [searchText, setSearchText] = useState(''); 
  const backhome = () => {
    navigation.navigate('Add a car', { email }); // Navigate to the 'Faq' screen with the email parameter
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Retrieve the collection of FAQs from Firestore
        const faqsSnapshot = await firestore.collection('faq').get();
        // Map over the documents in the snapshot and add showAnswer property to each FAQ item
        const faqsData = faqsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          showAnswer: false, // Add showAnswer property to each FAQ item
        }));
        setFaqs(faqsData); // Set the state variable "faqs" to the fetched FAQ data
        setFilteredFaqs(faqsData); // Set the state variable "filteredFaqs" to the fetched FAQ data
      } catch (error) {
        console.error('Error fetching FAQs: ', error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAnswer = index => {
    setFaqs(prevFaqs => {
      const updatedFaqs = [...prevFaqs];
      updatedFaqs[index].showAnswer = !updatedFaqs[index].showAnswer;
      return updatedFaqs;
    });
  };

  const renderFaqItem = ({ item, index }) => (
    <TouchableOpacity
      className="p-4 mb-4 bg-white shadow-sm rounded-8 font-customs"
      onPress={() => toggleAnswer(index)}
    >
      <Text className="mb-1 text-lg font-bold font-customs">{item.Question}</Text>
      {item.showAnswer && <Text className="text-sms font-customs ">{item.answer}</Text>}
    </TouchableOpacity>
  );

  const handleSearch = text => {
    setSearchText(text);
    const filteredData = faqs.filter(faq =>
      faq.Question.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFaqs(filteredData);
  };
  return(
    <View className="flex-1 bg-white ">
    <View className="h-auto bg-[#F1EFE9] w-full p-4">
    <View className="flex-row items-center justify-between mt-12 ">
      <TouchableOpacity onPress={() => navigation.navigate('Home', { email })}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
     <View>
     <Text className="text-xl font-bold font-customs">Help Center</Text>
     </View>
     
      <TouchableOpacity onPress={backhome}>
        <Ionicons name="car" size={24} color="black" />
      </TouchableOpacity>
    </View>
    </View>
    
  
  <View className="h-full p-4 ">
     <Text className="mt-4 mb-2 text-xl font-bold font-customs">Frequently Asked Questions</Text>
    <View className="flex-row items-center  font-customs bg-[#F1EFE9]  mb-2 border border-[#F1EFE9] rounded-full px-4 py-2">
      <TextInput
        className="flex-1 mr-2 font-customs "
        placeholder="Search the most asked question"
        value={searchText}
        onChangeText={handleSearch}
      />
      <TouchableOpacity
        className="bg-[#F1EFE9] rounded-full px-2 py-1"
      >
        <Ionicons name="search-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
    <FlatList
      data={filteredFaqs}
      renderItem={renderFaqItem}
      keyExtractor={item => item.id}
      className="flex-1"
    />
   </View>
  
  </View>
  );
}






























const SettingsScreenDeux = ({route})=>{
  const {email} = route.params;
  const navigation = useNavigation();
  const handleAccount = ()=>{
    navigation.navigate("Account", { email });
   }
   
   const handleHelp = ()=>{
    navigation.navigate("Help Center", { email });
   }

   const handleOrderscars=()=>{
    navigation.navigate("Orderscars", { email });
   }

   const handleCars= () =>{
    navigation.navigate("My cars", { email });
   }

   const handleTheCar= () =>{
    navigation.navigate("My orders", { email });
   }

   const handleTheCars= () =>{
    navigation.navigate("My cars", { email });
   }

   const clickhere = ()=>{
    navigation.navigate("My orders", { email });
   }
  return(
    <View className="h-full bg-white ">

      <View className="h-auto bg-[#F1EFE9] w-full p-4">
          <View className="flex-row items-center justify-between mt-12 ">
            <TouchableOpacity onPress={handleTheCars}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          <View>
          <Text className="text-xl font-bold font-customs">Settings</Text>
          </View>
          
            <TouchableOpacity onPress={handleCars}>
              <Ionicons name="car" size={24} color="black" />
            </TouchableOpacity>
          </View>
          </View>
          <View className="bg-[#F1EFE9] w-full h-42 pb-4 items-center">
            <Text className="px-4 mt-4 text-3xl font-customs">
               To Manage your orders 
            </Text>
            <TouchableOpacity className="p-4 mt-4 bg-black rounded-full " onPress={clickhere}>
              <Text className="text-white font-customs ">
                 Click here
              </Text>
            </TouchableOpacity>
          </View>
          
    
       
      
      <View className="flex mt-4 ml-4">
        
      <TouchableOpacity className="mt-4 ml-2" onPress={handleAccount}>
        <View className="flex flex-row items-center">
      
          <Text className="font-customs">Change your credentials</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4 ml-2" onPress={handleHelp}>
        <View className="flex flex-row items-center">
      
          <Text className="font-customs">Go to Help center</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4 ml-2" onPress={handleCars}>
        <View className="flex flex-row items-center">
    
          <Text className="font-customs">Manage my cars</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4 ml-2" onPress={handleTheCar}>
        <View  className="flex flex-row items-center">
     
          <Text className="font-customs">My orders</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4 ml-2" onPress={handleOrderscars}>
        <View  className="flex flex-row items-center">
     
          <Text className="font-customs">Orders for my car</Text>
        </View>
      </TouchableOpacity>


  
      </View>
     
     
    </View>
  );
}












  const AccountScreen = ({ route }) => {
    const { email: initialEmail } = route.params;

    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");



    
    const updateInformation = async () => {
      try {
        const userToUpdate = auth.currentUser;

        // Update email and password in authentication
        if (newEmail) {
          await userToUpdate.updateEmail(newEmail);
        }
        if (newPassword) {
          await userToUpdate.updatePassword(newPassword);
        }

        // Update email in Firestore collection 'users'
        await dbFirebase
          .collection("users")
          .doc(userToUpdate.uid)
          .update({
            email: newEmail || userToUpdate.email,
            password: newPassword || userToUpdate.password,
          });

        console.log("Account information updated successfully.");
      } catch (error) {
        console.error("Error updating account information:", error);
      }
    };


    return (
      <View style={tw`justify-center h-full bg-white dark:bg-gray-900`}>
        <View
          style={tw`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0`}
        >
          <View
            style={tw`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-70`}
          >
            <View style={tw`p-6 space-y-4 md:space-y-6 sm:p-8`}>
              <View style={tw`space-y-4 md:space-y-6`}>
                <Text
                  style={tw`block mb-2 text-sm font-medium text-gray-900 dark:text-whit`}
                  className="font-customs"
                >
                  New email 
                </Text>
                <TextInput
                  onChangeText={setNewEmail}
                  value={newEmail}
                  style={tw`block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                ></TextInput>
              </View>

              <View>
                <Text
                  style={tw`block mb-2 text-sm font-medium text-gray-900 dark:text-whit`}
                  className="font-customs"
                >
                  New Password
                </Text>
                <TextInput
                  onChangeText={setNewPassword}
                  value={newPassword}
                  style={tw`block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                ></TextInput>
              </View>

              <TouchableOpacity
                style={tw`w-full mt-4 items-center text-white bg-black hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
                onPress={updateInformation}
              >
                <Text style={tw`text-white`} className="font-customs">Update my information</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };













  
  const HomeScreen = ({route}) => {
    const email = route.params?.email;
    const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator>


        
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="compass" color={'gray'} size={size} />
            ),
          }}
          name="Search"
          initialParams={{ email }}
          component={ HomesScreen}
        />





      

        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={'gray'} size={size} />
            ),
          }}
          name="Add a car"
          initialParams={{ email }}
          component={AskkeyScreen}
        />



<Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="bell" color={'gray'} size={size} />
            ),
          }}
          name="Chat"
          initialParams={{ email }}
          component={ ChatScreen}
        />
        
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={'gray'} size={size} />
            ),
          }}
          initialParams={{ email }}
          name="Settings"
          component={SettingsScreenDeux}
        />






        

      </Tab.Navigator>
    );
  };













  

const PresentationOne=({route})=>{
  const navigation = useNavigation();
  const { email } = route.params;
  const direct = () => {
    navigation.navigate('Home', { email });
  };
  const secondscreen = () => {
    navigation.navigate('Presentation-two', { email });
  };

  
  return(
    <ScrollView className="h-full bg-white">
    <View className="h-full bg-white">
      {/* Image with z-index: -10 */}
      <View className="z-[-10]">
        {/* Add negative margin to the top to cover the space */}
        <Image
          source={{
            uri:
              'https://cdn.dribbble.com/users/2654273/screenshots/20479476/media/7b8b842f8dee292c642da54378709f71.png?resize=640x480&vertical=center',
          }}
          style={{ width: '100%', height: 450, marginTop: -40 }}
        />
      </View>
      {/* Box with z-index: -20 */}
      <View className="rounded-t-[40px]  border-gray-600 shadow-3xl z-[-20] relative">
        <View className="w-full h-full bg-white rounded-t-40 relative z-[20]">
          <View className="items-start p-4 w-400px">
            <Text className="mt-4 text-gray-600 font-customs text-16">How to chat</Text>
            <Text className="font-customs text-28 mt-4 text-[27px]">
              We help you secure your informations and we allow you to chat with other users
            </Text>
  
            <View className="flex-row items-center justify-center mt-12 mb-4 ml-auto mr-auto space-x-4">
              <View className="w-4 h-2 bg-black rounded-full"></View>
              <View className="w-2 h-2 rounded-full bg-[#BEBFC4]"></View>
              <View className="w-2 h-2 rounded-full bg-[#BEBFC4]"></View>
            </View>
  
            <View className="flex-row items-center w-full mt-4">
              <TouchableOpacity onPress={direct} className="py-5 px-16 rounded-full bg-[#E3E3E3] my-6 mr-4">
                <Text className="text-black font-customs">Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={secondscreen} className="px-16 py-5 my-6 bg-black rounded-full">
                <Text className="text-white font-customs">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
  );
}




const PresentationTrois= ({route})=>{
  const navigation = useNavigation();
  const {email , password, name, country} = route.params;


  const Homescreen = () => {
    navigation.navigate('Home',{email });
  };

  
  return(
    <ScrollView className="h-full bg-white">
<View className="h-full bg-white ">
      
      <View className="z-10 ">
      <Image
         source={{
           uri:
             'https://cdn.dribbble.com/users/1811807/screenshots/16114634/media/22f12695bafc4d16b41bb427d634277f.png?resize=1600x1200&vertical=center',
         }}
         style={{ width: '100%', height: 450 }}
       />
      </View>
 
       <View className="w-full h-full bg-white rounded-t-[40px]  z-20 ">
         <View className="w-[400px] items-start p-4">
           <Text className="text-gray-600 mt-4 font-customs text-[16px]">Help Center</Text>
           <Text className="font-customs text-[28px] mt-4">
            You can contact us if you need more information
           </Text>
          
 
       
          <View className="flex-row items-center justify-center mt-12 mb-4 ml-auto mr-auto space-x-4">
           <View className="w-4 h-2 bg-black rounded-full"></View>
           <View className="w-2 h-2 bg-black rounded-full"></View>
           <View className="w-2 h-2 bg-black rounded-full"></View>
         </View>
        
 
           <View className="flex-row items-center w-full mt-4 d-flex">
            
             <TouchableOpacity onPress={Homescreen} className="px-16 py-5 my-6 bg-black rounded-full">
               <Text className="text-white font-customs">Next</Text>
             </TouchableOpacity>
           </View>
         </View>
       </View>
     </View>
    </ScrollView>
  );
}


  












const PresentationDeux= ({route})=>{
  
  const navigation = useNavigation();
    const {email , password, name, country} = route.params;
    const direct = () => {
      navigation.navigate('Home',{email});
    };

    const thirdcreen = () => {
      navigation.navigate('Presentation-trois',{email});
    };
    
  return(
    <ScrollView className="h-full bg-white">
    <View className="h-full bg-white ">
          
          <View className="z-10 ">
          <Image
             source={{
               uri:
                 'https://cdn.dribbble.com/userupload/2809453/file/original-ce78ea9d7c12e33f61c509effc832dc3.jpg?resize=1200x900',
             }}
             style={{ width: '100%', height: 450 }}
           />
          </View>
     
           <View className="w-full h-full bg-white rounded-t-[40px]  z-20 ">
             <View className="w-[400px] items-start p-4">
               <Text className="text-gray-600 mt-4 font-customs text-[16px]">Book and rent</Text>
               <Text className="font-customs text-[28px] mt-4">
               Make sure to enable all required settings 
               </Text>
              
     
           
              <View className="flex-row items-center justify-center mt-12 mb-4 ml-auto mr-auto space-x-4">
               <View className="w-4 h-2 bg-black rounded-full"></View>
               <View className="w-2 h-2 bg-black rounded-full"></View>
               <View className="w-2 h-2 rounded-full bg-[#BEBFC4]"></View>
             </View>
            
     
               <View className="flex-row items-center w-full mt-4 d-flex">
                 <TouchableOpacity onPress={direct} className="py-5 px-16 rounded-full bg-[#E3E3E3] my-6 mr-4">
                   <Text className="text-black font-customs">Skip</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={thirdcreen} className="px-16 py-5 my-6 bg-black rounded-full">
                   <Text className="text-white font-customs">Next</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
        </ScrollView>
  );
}











  





const Forget=({route})=>{
   
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const navigation = useNavigation();
  

      const handleKey = async () => {
        try {
          const userRef = dbFirebase.collection('users'); // Use dbFirebase directly
          const querySnapshot = await userRef
            .where('email', '==', email)
            .where('key', '==', key)
            .get();

          if (querySnapshot.empty) {
            // No matching user found in the "users" collection
            console.error('Authentication failed. User not found.');
            // Handle authentication error (e.g., show an error message to the user)
          } else {
            // Authentication successful; navigate to the next screen
            navigation.navigate('Home', { email }); // Change 'Home' to your desired screen
          }
        } catch (error) {
          console.error('Authentication failed', error.message);
          // Handle other authentication errors if needed
        }
      };



  
  return(
        <View className="justify-center h-full bg-black ">
                 <View className="items-center justify-center ">
                 <Image source={require('./assets/logoandroid.png')}  className="items-center w-12 h-12 mb-12" />
                    
                 </View>


                  <View className="p-12">
                  <View style={tw`items-start block mb-2`}>
                <Text
                className={"font-customs"}
                  style={tw`text-sm font-medium text-white font-customs dark:text-white`}
                >
                  Your Email 
                </Text>
              </View>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={tw`bg-black mb-4 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              ></TextInput>

<View style={tw`block mb-2`}>
                <Text
                className={"font-customs"}
                  style={tw`text-sm font-medium text-white font-customs dark:text-white`}
                >
                  Your Key
                </Text>
              </View>
              
              
            <TextInput
                placeholder="key"
                value={key}
                onChangeText={(text) => setKey(text)}
                style={tw`bg-black mb-4 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              ></TextInput>


            <TouchableOpacity
                onPress={handleKey}
                className="bg-[#199FF0]"
                style={tw`w-full mt-4 items-center text-white  focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
              >
                <Text className="text-white font-customs">Let's go</Text>
              </TouchableOpacity>
                  </View>
        </View>
        
  );
}




   




 
























  const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      // Check if the user is already signed in when the component mounts
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, navigate to the home screen
          navigation.replace('Home',{email});
        }
      });
    
      // Clean up the subscription when the component unmounts
      return () => unsubscribe();
    }, []);
    
    const handle = () => {
      navigation.navigate("SignUp");
    };

    const handletwo=()=>{
      navigation.navigate("Forget");
    }    
   
  
    const handleLogin = () => {
      setIsLoading(true);
    
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const { email } = user;
          navigation.replace('Home',{email});
        })
        .catch((error) => {
          console.log('Login error:', error);
          setErrorModalVisible(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    
    
    return (
      <View style={tw`justify-center h-full bg-black dark:bg-gray-900`}>
        <View
          style={tw`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0`}
        >
          <View
            style={tw`w-full bg-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-70`}
          >
            <View style={tw`p-6 space-y-4 md:space-y-6 sm:p-8`}>
              <View style={tw`space-y-4 md:space-y-6`}>
               <View style={tw`items-center`}>
               <Image source={require('./assets/logoandroid.png')}  className="w-12 h-12" />
               </View>
                <View style={tw`block mb-2`}>
                  <Text
                  className={"font-customs"}
                    style={tw`text-sm font-medium text-white font-customs dark:text-white`}
                  >
                    Your Email 
                  </Text>
                </View>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={tw`bg-black mb-4 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                ></TextInput>

                <View style={tw`block mt-4`}>
                  <Text
                  className="font-customs"
                    style={tw`text-sm font-medium text-white dark:text-white`}
                  >
                    Your Password 
                  </Text>
                </View>

                <TextInput
                  placeholder="Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                  style={tw`bg-black border border-gray-300 text-white mt-2 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                ></TextInput>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                className="bg-[#199FF0]"
                style={tw`w-full mt-4 items-center text-white  focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
              >
                <Text className="text-white font-customs">Login</Text>
              </TouchableOpacity>

             

              <TouchableOpacity
                onPress={handle}
                style={tw`w-full mt-4 items-center text-white bg-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
              >
                <Text style={tw`text-black font-custom`} className="text-black font-customs"> Create an account</Text>
              </TouchableOpacity>

              <View style={tw`items-center justify-center pt-2`}>
              <Text style={tw`items-center justify-center text-white`}>
                Or
              </Text>
              </View>
              
              <TouchableOpacity
                onPress={handletwo}
                style={tw`w-full mt-4 items-center border-2 border-white text-white bg-black hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
              >
                <Text  className="text-white font-customs"> You forget your password ? </Text>
              </TouchableOpacity>


              

              <View style={tw`p-6 space-y-4 md:space-y-6 sm:p-8`}>
                <Modal visible={errorModalVisible} animationType="slide">
                  <View style={tw`items-center justify-center flex-1`}>
                    <Text style={tw`mb-4 text-xl font-semibold text-red-600`}>
                      User not found
                    </Text>
                    <TouchableOpacity
                      style={tw`px-5 py-2 bg-blue-500 rounded-lg hover:bg-blue-600`}
                      onPress={() => setErrorModalVisible(false)}
                    >
                      <Text style={tw`text-sm font-medium text-white`}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };








  

  


  const OrdersDetails = ({ route }) => {
    const {email}= route.params;
    const [ordersData, setOrdersData] = useState([]);
  
    useEffect(() => {
      const unsubscribe = firestore
        .collection('orders')
        .where('email', '==', email)
        .where('payment', '==', 'validated')
        .onSnapshot((snapshot) => {
          const orders = snapshot.docs.map((doc) => doc.data());
          setOrdersData(orders);
        });
  
      return () => unsubscribe();
    }, [email]);
  
    return (
      <View className="flex-1 bg-white">
      <ScrollView className="flex-grow mt-24">
        {ordersData.map((orderDetails, index) => (
          <View key={index} className="p-4 mb-4 bg-white border border-gray-300 rounded-lg">
          <View className="flex flex-row">
          <Text className="mb-2 mr-4 text-2xl font-customs">
              Your order the car from {orderDetails.item.name}
            </Text>
            <Image source={{ uri: orderDetails.item.profilePicture }}   style={{height: 30, width: 30, borderRadius:50,}} />
          </View>
            <Text className="text-base font-customs">
              Don't forget you should pick up the car on {orderDetails.pickupDate} and return it on
              {orderDetails.returnDate}. The place where you have to
              pick up the car is {orderDetails.item.address} in {orderDetails.item.state}. You
              can contact {orderDetails.item.name} at {orderDetails.item.phoneNumber}. If you
              broke the car you should contact {orderDetails.item.assuranceNumber}.
            </Text> 
          </View>
        ))}
      </ScrollView>
    </View>
    );
  };
  

  



  




 
  

 
 
  
  const SignUpScreen = ({route}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [key, setKey] = useState('');
  const [country, setCountry] = useState('');
  const [profileImage, setProfileImage] = useState(null); // State to hold the selected profile image
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // New state for loading spinner
  // Function to handle the image picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    // Perform signup with email and password
    auth.createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signup successful
        const user = userCredential.user;
        const { uid, email } = user;
        // Upload profile image to Firebase Storage
        let profileImageUrl = null;
        if (profileImage) {
          const response = await fetch(profileImage);
          const blob = await response.blob();
          const storageRef = storage.ref().child(`profile_images/${uid}`);
          await storageRef.put(blob);
          profileImageUrl = await storageRef.getDownloadURL();
        }

        // Add user data to Firestore collection
        await firestore.collection('users').doc(uid).set({
          email: email,
          password:password,
          name: name,
          key:key,
          phone:phone,
          country: country,
          profileImage: profileImageUrl, // Add the profile image URL to Firestore
        });

        // Navigate to HomeScreen and pass user parameters
        navigation.navigate('Presentation-one', {
          email: email,
          password: password,
          name: name,
          phone:phone,
          key:key,
          country: country,
        });
      })
      .catch((error) => {
        // Handle signup error
        console.log('Signup error:', error);
      }) .finally(() => {
        setIsLoading(false); // Hide loading spinner when signup process is done
      });;
  };

    return (
      <View className="items-center justify-center flex-1 p-4 bg-black">
      <Text className="mb-4 text-lg text-white font-customs">Profile Picture</Text>
       <TouchableOpacity className="mb-12" onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <View style={{ backgroundColor: 'gray', width: 100, height: 100, borderRadius: 50 }} />
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Email"
        value={email}
        placeholderTextColor="white" 
        onChangeText={(text) => setEmail(text)}
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="white" 
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />
      <TextInput
        placeholder="Name"
        placeholderTextColor="white" 
        value={name}
        onChangeText={(text) => setName(text)}
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />
      <TextInput
        placeholder="Country"
        placeholderTextColor="white" 
        value={country}
        onChangeText={(text) => setCountry(text)}
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />

<TextInput
        placeholder="Mobile Phone number"
        placeholderTextColor="white" 
        value={phone}
        onChangeText={(text) => setPhone(text)}
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />


<TextInput
        placeholder="Your key in case you forget your password"
        placeholderTextColor="white" 
        value={key}
        onChangeText={(text) => setKey(text)}
        className="w-full h-10 px-2 mb-4 text-white border border-gray-300 rounded-md font-customs"
      />
     

     <TouchableOpacity className="w-full px-4 py-2 mb-4 bg-white rounded-full font-customs" onPress={handleSignup}>
        {isLoading ? ( // Show loading spinner when isLoading is true
          <ActivityIndicator color="black" />
        ) : (
          <Text className="font-bold text-center text-black font-customs">Sign up</Text>
        )}
      </TouchableOpacity>
    </View>
    );
  };


  








  const Orderscars = ({route})=>{
    const { email } = route.params;
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
      const unsubscribe = firestore
        .collection('orders')
        .where('car.myemail', '==', email)
        .where('payment', '==', 'validated')
        .onSnapshot((snapshot) => {
          const orders = snapshot.docs.map((doc) => doc.data());
          setOrdersData(orders);
        });
  
      return () => unsubscribe(); // Cleanup the subscription when the component unmounts
    }, [email]);
    
    return(
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        style="flex-1 w-full bg-white mt-3"
      >
        {ordersData.map((order, index) => (
          <View key={index} style="w-full px-4 py-2 mb-4">
            <Text className="mb-4 text-xl font-customs">Client Information</Text>
            <Text className="text-sm font-customs">Full Name: {order.fullName}</Text>
            <Text className="text-sm font-customs">Mobile Number: {order.mobileNumber}</Text>
            <Text className="text-sm font-customs">Insurance: {order.insurance}</Text>
            <Text className="text-sm font-customs">Pickup Date: {order.pickupDate.toDate().toLocaleString()}</Text>
            <Text className="text-sm font-customs">Return Date: {order.returnDate.toDate().toLocaleString()}</Text>
            <View style="my-6 mt-12">
              {/* Display the driver license image */}
              <Image
                source={{ uri: order.driverLicenseUrl }}
                style={{ width: 200, height: 200, borderRadius: 15, marginTop: 12 }}
              />
            </View>

            <Text className="mt-4 mb-4 text-xl font-customs">The renter</Text>
            <Text className="text-sm font-customs">Insurance: {order.car.name}</Text>
            <Text className="text-sm font-customs">Phone number: {order.car.phoneNumber}</Text>
            <Text className="text-sm font-customs">Address: {order.car.address}</Text>
            <Text className="text-sm font-customs">Insurance name: {order.car.assuranceName}</Text>
            <Text className="text-sm font-customs">Insurance number: {order.car.assuranceNumber}</Text>
            <Text className="text-sm font-customs">Car Name: {order.car.carName}</Text>
            <Text className="text-sm font-customs">City: {order.car.city}, {order.car.country}</Text>
            <Text className="text-sm font-customs">KM used: {order.car.kilometersUsed}</Text>
           
          </View>
        ))}
   
      </ScrollView>
    </View>
    );
  }


  
  export default function App() {
    const [fontsLoaded] = useFonts({
      'Uberfont': require('./assets/fonts/UberMoveMedium.ttf'),
      'Uberfontdeux': require('./assets/fonts/UberMoveMedium.ttf')
    });
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      // Simulating loading time
      
      setTimeout(() => {
        setIsLoading(false);
        
      }, 2000);
    }, []);
  
    if (!fontsLoaded || isLoading) {
      return <ActivityIndicator size="large" color="black" />;
    }



    
    
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} /> 
            <Stack.Screen options={{ headerShown: false}}  name="SignUp" component={SignUpScreen} />
            <Stack.Screen options={{ headerShown: false}}  name="Details" component={DetailsScreen} />
            <Stack.Screen options={{ headerShown: false}}  name="Rent first" component={RentScreen} />
            <Stack.Screen options={{ headerShown: false}}  name="Rent Second" component={BookingSecondScreen} />
            <Stack.Screen options={{ headerShown: false}}  name="Payment Total Price" component={PaymentTotalPrice} />
            <Stack.Screen options={{ headerShown: false}}  name="Payment final" component={Payment} />
            <Stack.Screen options={{ headerShown: false}}  name="AskkeyNowScreen" component={AskkeyNowScreen} />
            <Stack.Screen  options={{headerShown: false}} name="Publishcar" component={PublishCarNow} />
            <Stack.Screen  options={{headerShown: false}} name="Four Step add car" component={FourStepaddcar} />
            <Stack.Screen  options={{headerShown: false}} name="Third Step add car" component={ThirdStepaddcar} />
            <Stack.Screen options={{headerShown: false}} name="Second Step add car" component={SecondStepaddcar}/> 
            <Stack.Screen options={{headerShown: false}} name="Chatroom" component={ChatRoomScreen}/> 
            <Stack.Screen options={{headerShown: false}} name="My cars" component={MyCarsScreen}/> 
            <Stack.Screen options={{headerShown: false}} name="Settings" component={SettingsScreenDeux}/> 
            <Stack.Screen options={{headerShown: false}} name="Account" component={AccountScreen}/> 
            <Stack.Screen options={{headerShown: false}} name="Help Center" component={HelpCenter}/> 
            <Stack.Screen options={{headerShown: false}} name="My orders" component={OrdersDetails}/> 
            <Stack.Screen options={{headerShown: false}} name="Orderscars" component={Orderscars}/> 
            <Stack.Screen options={{headerShown: false}} name="Presentation-one" component={PresentationOne}/> 
            <Stack.Screen options={{headerShown: false}} name="Presentation-two" component={PresentationDeux}/> 
            <Stack.Screen options={{headerShown: false}} name="Presentation-trois" component={PresentationTrois}/> 
            <Stack.Screen options={{headerShown: false}} name="CarAsk" component={CarAsk}/> 
            <Stack.Screen options={{headerShown: false}} name="Forget" component={Forget}/> 
          

          
         
          






         
     
  <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }



