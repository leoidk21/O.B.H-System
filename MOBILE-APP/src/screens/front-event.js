import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE = "https://ela-untraceable-foresakenly.ngrok-free.dev/api";

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const FrontEvent = () => {
  const [form, setForm] = useState({
    user_id: '',
    event_type: '',
    package: '',
    client_name: '',
    event_date: '',
    event_segments: '',
    guest_count: '',
    venue: '',
    budget: '',
    proof_of_payment: '',
    e_signature: '',
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    try {
      const token = 'your_mobile_user_jwt'; // replace with actual stored token
      const res = await fetch('http://<YOUR_DESKTOP_IP>:5000/api/event-plan/event-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) Alert.alert('Success', data.message);
      else Alert.alert('Error', data.error || 'Failed to submit event');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network or server issue');
    }
  };

  return (
    <View>
      <TextInput placeholder="Event Type" onChangeText={(v) => handleChange('event_type', v)} />
      <TextInput placeholder="Client Name" onChangeText={(v) => handleChange('client_name', v)} />
      <TextInput placeholder="Event Date" onChangeText={(v) => handleChange('event_date', v)} />
      {/* Add more fields as needed */}
      <Button title="Submit Event" onPress={handleSubmit} />
    </View>
  );
};

export default FrontEvent;
