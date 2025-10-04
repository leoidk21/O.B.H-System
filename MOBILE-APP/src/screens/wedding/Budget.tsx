import React, {  useState } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { RootStackParamList } from "../../screens/type";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const Budget = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryModal, setCategoryModal] = useState(false);
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [editBudgetModal, setEditBudgetModal] = useState(false);

    interface Expense {
        id: number;
        category: string;
        amount: number;
        status: string;
    }

    // Close modal functions
    const closeModal = () => setModalVisible(false);
    const closeCategoryModal = () => setCategoryModal(false);
    const closeRsvpModal = () => setAddCategoryModal(false); 
    const closeEditBudgetModal = () => setEditBudgetModal(false);

    // Add these state variables to your existing state declarations
    const [originalBudget, setOriginalBudget] = useState<number>(0.00);
    const [totalBudget, setTotalBudget] = useState<number>(0.00);
    const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
    const [editBudgetValue, setEditBudgetValue] = useState<string>('');

    const [inputBudget, setInputBudget] = useState<string>('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categoryInput, setCategoryInput] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([
        'Venue', 'Photo & Video', 'Catering and design', 'Food Booths', 
        'Photobooth', 'HMUA', 'Catering'
    ]);
    const [expenseAmount, setExpenseAmount] = useState<string>('');
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

    // These calculations will now work correctly
    const totalSpent = originalBudget - totalBudget;
    const remainingBudget = totalBudget;
    const budgetPercentage = originalBudget > 0 ? (totalSpent / originalBudget) * 100 : 0;

    // Add these handler functions
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [isBudgetSet, setIsBudgetSet] = useState(false);

    const handleBudgetSubmit = () => {
        if (inputBudget) {
            const budgetValue = parseFloat(inputBudget);
            setOriginalBudget(budgetValue);
            setTotalBudget(budgetValue);
            setInputBudget('');
            setEditBudgetModal(false);
            setIsBudgetSet(true);
        }
    };

    const handleExpenseSubmit = () => {
        if (expenseAmount && selectedCategory !== null) {
            const expenseValue = parseFloat(expenseAmount);
            
            // Check if there's enough budget remaining
            if (expenseValue > totalBudget) {
            Alert.alert(
                "Over Budget",
                "This expense exceeds your remaining budget.",
                [{ text: "OK" }]
            );
            return;
            }
            
            const newExpense: Expense = {
                id: expenses.length + 1,
                category: categories[selectedCategory],
                amount: expenseValue,
                status: 'Pending'
            };
            
            // Update both expenses and subtract from total budget
            setExpenses([...expenses, newExpense]);
            setTotalBudget(prevBudget => prevBudget - expenseValue);
            setExpenseAmount('');
            setSelectedCategory(null);
            setModalVisible(false);
        }
    };

    const handleAddCategory = () => {
        if (categoryInput.trim()) {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
            setAddCategoryModal(false);
            setCategoryModal(true);
        }
    };

    const handleEditBudget = () => {
        if (editBudgetValue) {
            const newBudgetValue = parseFloat(editBudgetValue);
            const difference = newBudgetValue - originalBudget;
            
            setOriginalBudget(newBudgetValue);
            setTotalBudget(prevBudget => prevBudget + difference);
            setEditBudgetValue('');
            setEditBudgetModal(false);
            
            Alert.alert(
                "Budget Updated",
                `Your budget allocation is now ₱ ${newBudgetValue.toLocaleString()}`,
                [{ text: "OK" }]
            );
        }
    };

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={["#FFFFFF", "#f2e8e2ff"]}
                style={{ flex: 1 }}
            >
            {/* HEADER */}
            <View>
                <NavigationSlider headerTitle="Budget" />
            </View>
            {/* HEADER */}
            
            {/* BUDGET CONTENT */}
            <LinearGradient
                colors={["#00B4E5", "#58B0E0"]}
                style={styles.linearGradient}
            >
                <View>
                    <View style={styles.editBudgetContainer}>
                        {/* EDIT BUDGET ICON - Now with the modal function */}
                        <TouchableOpacity
                            onPress={() => {
                                setEditBudgetModal(true)
                                if (isBudgetSet) {
                                    setEditBudgetValue(originalBudget.toString());
                                }
                            }}
                            style={styles.editBudget}
                        >
                            <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <Path d="M19.2254 6.18374L6.66809 18.7411C5.54671 19.8731 2.19315 20.3914 1.37856 19.6402C0.563969 18.8891 1.15638 15.5357 2.27776 14.4037L14.8351 1.84635C15.415 1.29414 16.1878 0.990474 16.9884 1.00023C17.789 1.00999 18.5541 1.3324 19.1203 1.89859C19.6865 2.46477 20.0089 3.22989 20.0187 4.03054C20.0285 4.8312 19.7248 5.60392 19.1725 6.18374H19.2254Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                <Path d="M20.1257 20H10.6045" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.totalBudgetContainer}>
                        <View style={styles.totalBudget}> 
                            <Text style={styles.totalBudgetText}>Total Budget</Text>
                                <Text style={styles.totalBalanceText}>
                                    {isEnabled ? `₱ ${totalBudget.toLocaleString()}` : '₱ ******'}
                                </Text>
                        </View>
                        <View style={styles.budgetIllustration}>
                            <Image
                                source={require("../../assets/BUDGETILLU.png")}
                                style={{
                                    width: wp("40%"),
                                    height: wp("40%"),
                                    aspectRatio: 1 / 1,
                                    resizeMode: "cover",
                                }}
                            />
                        </View>
                    </View>    
                </View>
            </LinearGradient>
            {/* BUDGET CONTENT */}

            {/* BUDGET TRACKING */}
            <View style={styles.budgetContainer}>
                {/* BUDGET TRACKING - CONTEXTUAL */}
                <View style={styles.budgetTrackingContainer}>
                    <View style={styles.budgetTracking}>
                        <View>
                            <Text style={styles.budgetBalanceText}>{Math.round(budgetPercentage)}%</Text>
                        </View>

                        {/* Contextual message based on spending */}
                        <View style={styles.budgetTrackingDetails}>
                            <Text style={[
                                styles.budgetStatusMessage,
                                { color: budgetPercentage > 75 ? '#e74c3c' : budgetPercentage > 50 ? '#f39c12' : '#27ae60' }
                            ]}>
                                {budgetPercentage > 90 ? '⚠️ Over budget!' : 
                                budgetPercentage > 75 ? 'Approaching budget limit' : 
                                budgetPercentage > 50 ? 'Halfway through budget' : 
                                'Within budget'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.budgetTrackingBar}>
                        <View 
                            style={[
                                styles.budgetTrackingBarFill, 
                                { width: `${budgetPercentage}%` }
                            ]} 
                        />
                    </View>
                </View>

                <View style={styles.remainingBalanceContainer}>
                    <View>
                        <Text
                            style={{
                                fontSize: wp("4%"),
                            }}
                        >
                            Total Spent
                        </Text>
                        <Text style={styles.remainingBalanceText}>₱ {totalSpent.toLocaleString()}</Text>
                    </View>
                    <View>
                        <Text 
                            style={{
                                fontSize: wp("4%"),
                            }}
                        >
                            Remaining
                        </Text>
                        <Text style={styles.totalBudgetAmountText}>₱ {totalBudget.toLocaleString()}</Text>
                    </View>
                </View>
            </View>
            {/* BUDGET TRACKING */}

            {/* EXPENSES */}
            <View style={styles.expensesContainer}>
                {!isBudgetSet ? (
                    <View>
                        <Text style={styles.budgetRequiredText}>
                            Set a budget to start tracking expenses
                        </Text>
                    </View>
                ) : (
                    <View>
                        <View style={styles.expensesHeader}>
                            <Text style={styles.expensesHeaderTitle}>Expenses Breakdown</Text>
                        </View>
                        <View style={styles.expensesGridContainer}>
                            <View style={styles.expensesGridHeader}>
                                <Text>Category</Text>
                                <Text>Amount</Text>
                                <Text>Status</Text>
                            </View>
                            <View style={styles.expensesGridItemDivider}></View>
                        
                            {expenses.length === 0 ? (
                                <View style={styles.noExpensesContainer}>
                                    <Text style={styles.noExpensesText}>
                                        No expenses added yet
                                    </Text>
                                </View>
                            ) : (
                            expenses.map((expense: Expense, index: number) => (
                                <View key={expense.id} style={styles.expensesGridItem}>
                                    <Text style={styles.expenseCategoryText}>{index + 1}. {expense.category}</Text>
                                    <Text>{isEnabled} {expense.amount}</Text>
                                    <Text>{expense.status}</Text>
                                </View>
                            ))
                        )}
                        </View>
                    </View>
                )}         
            </View>
            {/* EXPENSES */}

            {/* ENTER BUDGET MODAL */}
            <Modal
                visible={editBudgetModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditBudgetModal(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalTitle}>
                                {isBudgetSet ? 'Edit Budget' : 'Enter Budget'}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setEditBudgetModal(false);
                                    setInputBudget('');
                                }}
                            >
                                <Text style={styles.closeIcon}>&times;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalDivider}></View>

                        <View>
                            <TextInput
                                style={[styles.inputField, styles.labelInputStyle]}
                                placeholder={isBudgetSet ? `Current: ₱ ${originalBudget.toLocaleString()}` : "Amount"}
                                keyboardType="number-pad"
                                value={isBudgetSet ? editBudgetValue : inputBudget}
                                onChangeText={isBudgetSet ? setEditBudgetValue : setInputBudget}
                            />
                            <View style={styles.actionButtonContainer}>
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={isBudgetSet ? handleEditBudget : handleBudgetSubmit}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        {isBudgetSet ? 'Update Budget' : 'Add Budget'}
                                    </Text>  
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ENTER BUDGET MODAL */}

            {/* ADD NEW BUDGET MODAL */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalTitle}>Add a Budget Cost</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeIcon}>&times;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalDivider}></View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Amount"
                                keyboardType="number-pad"
                                value={expenseAmount}
                                onChangeText={setExpenseAmount}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setCategoryModal(true)
                                setModalVisible(false)
                            }}
                        >
                            <View style={styles.categorySelector}>
                                <Text>
                                    {selectedCategory !== null 
                                        ? categories[selectedCategory] 
                                        : "Select a Category"
                                    }
                                </Text>
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    size={12}
                                    color="#343131"
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleExpenseSubmit}
                                disabled={!expenseAmount || selectedCategory === null}
                            >
                                <Text style={styles.primaryButtonText}>Add Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ADD NEW BUDGET MODAL */}

            {/* CATEGORY SELECTION MODAL */}
            <Modal
                visible={categoryModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCategoryModal(false)}
                statusBarTranslucent={true}
                onDismiss={closeCategoryModal}
            >
            {/* MODAL OVERLAY */}
            <View style={styles.modalOverlay}>
                {/* MODAL CONTAINER */}
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeaderContainer}>
                        <Text style={styles.modalTitle}>Category</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeCategoryModal}
                        >
                            <Text style={styles.closeIcon}>&times;</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalDivider}></View>

                    {/* CATEGORY SELECTION */}
                    <View>
                    <View style={styles.categoryGrid}>
                        {categories.map(
                        (label: string, index: number) => (
                            <TouchableOpacity
                            key={index}
                            style={[
                                styles.categoryItem,
                                {
                                backgroundColor: selectedCategory === index
                                    ? "#B47D4C"
                                    : "#ffffff",
                                },
                            ]}
                            onPress={() => {
                                setSelectedCategory(index);
                                setCategoryModal(false);
                                setModalVisible(true);
                            }}
                            >
                            <Text
                                style={[
                                styles.categoryItemText,
                                {
                                    color: selectedCategory === index
                                    ? "#ffffff"
                                    : "#000000",
                                },
                                ]}
                            >
                                {label}
                            </Text>
                            </TouchableOpacity>
                        )
                        )}
                    </View>
                    </View>
                    {/* CATEGORY SELECTION */}
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => {
                                setAddCategoryModal(true)
                                setCategoryModal(false)
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Add New Category</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* MODAL CONTAINER */}
            </View>
            {/* MODAL OVERLAY */}
            </Modal>
            {/* CATEGORY SELECTION MODAL */}

            {/* ADD NEW CATEGORY MODAL*/}
            <Modal
                visible={addCategoryModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAddCategoryModal(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalTitle}>Add a new category</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setAddCategoryModal(false)}
                            >
                                <Text style={styles.closeIcon}>&times;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalDivider}></View>
                        <View>
                            <TextInput
                                style={[styles.inputField, styles.labelInputStyle]}
                                placeholder="Label your category"
                                value={categoryInput}
                                onChangeText={setCategoryInput}
                            />
                            <TouchableOpacity
                                style={[styles.primaryButton, styles.labelButton]}
                                onPress={handleAddCategory}
                            >
                                <Text style={styles.primaryButtonText}>Add</Text>    
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ADD NEW CATEGORY MODAL*/}

            {/* ADD BUDGET BUTTON */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                        style={styles.button}
                        onPress={() => {
                            if (!isBudgetSet) {
                                // Show alert if budget is not set
                                Alert.alert(
                                    "Budget Required",
                                    "Please set a budget before adding expenses.",
                                    [
                                        { 
                                            text: "Set Budget", 
                                            onPress: () => setEditBudgetModal(true) 
                                        },
                                        { 
                                            text: "Cancel", 
                                            style: "cancel" 
                                        }
                                    ]
                                );
                            } else {
                                setModalVisible(true);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
            </View>
            {/* ADD BUDGET BUTTON */}
            </LinearGradient>
            <View>
                <MenuBar activeScreen="Budget"/>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    modalOverlay: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    modalContainer: {
        height: 'auto',
        width: wp("85%"),
        overflow: 'hidden',
        maxHeight: hp("100%"),
        borderRadius: wp("2.5%"),
        backgroundColor: colors.white,
    },

    modalHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: hp("1%"),
        marginHorizontal: wp("4%"),
        justifyContent: "space-between",
    },

    modalTitle: {
        fontSize: wp("5%"),
        paddingVertical: hp("0.5%"),
        fontWeight: '600',
    },

    closeButton: {
        margin: 0,
        padding: 0,
    },

    closeIcon: {
        fontSize: wp("7%"),
        color: '#666',
    },

    modalDivider: {
        width: wp("76%"),
        alignSelf: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    inputContainer: {
        alignSelf: "center",
        marginTop: hp("1.2%"),
        width: wp("76%"),
    },

    inputField: {
        borderWidth: 1,
        borderRadius: 9,
        width: '100%',
        marginTop: hp("1%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1.2%"),
        borderColor: colors.borderv3,
        fontSize: wp("4%"),
    },

    labelInputStyle: {
        width: '90%',
        alignSelf: "center",
        marginTop: hp("1.5%"),
    },

    labelButton: {
        alignSelf: "center",  
        marginTop: hp("1.5%"),
        marginBottom: hp("2%"),
    },

    categorySelector: {
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: hp("1.5%"),
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("3%"),
        borderColor: colors.borderv3,
        justifyContent: "space-between",
    },

    categoryGrid: {
        marginVertical: hp("1.5%"),
        marginHorizontal: wp("3.5%"),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        overflow: 'hidden',
    },

    categoryItem: {
        borderWidth: 1,
        borderRadius: 9,
        margin: wp("1%"),
        minWidth: wp("75%"),
        paddingLeft: wp("4%"),
        justifyContent: "center",
        borderColor: colors.border,
        paddingVertical: hp("1.2%"),
    },

    categoryItemText: {
        fontSize: wp("3.5%"),
    },

    actionButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: hp("2.5%"),
    },

    primaryButton: {
        width: wp("76%"),
        padding: wp("3%"),
        borderRadius: wp("2.5%"),
        backgroundColor: colors.button,
    },

    primaryButtonText: {
        textAlign: "center",
        color: colors.white,
        fontSize: wp("4%"),
        fontWeight: '600',
    },

    budgetItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    budgetItemName: {
        fontSize: wp("4%"),
        fontWeight: '500',
    },

    budgetItemAmount: {
        fontSize: wp("4%"),
        fontWeight: '600',
        color: '#2E7D32',
    },

    budgetItemCategory: {
        fontSize: wp("3%"),
        color: '#666',
        marginTop: hp("0.5%"),
    },

    headerText: {
        fontSize: wp("4.5%"),
    },

    burgerIcon: {
        width: wp("6%"),
        height: wp("6%"),
    },

    sidebarContainer: {
        flex: 1,
        zIndex: 1000,
    },

    buttonContainer: {
        marginRight: hp("2.2%"),
        alignSelf: "flex-end",
        marginTop: hp("3.5%"),
        position: "absolute",
        zIndex: 1000,
        bottom: hp("10%"),
        justifyContent: "flex-start",
    },
    
    button: {
        width: wp("12%"),
        height: wp("12%"),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: wp("20%") / 2,
        backgroundColor: colors.button,
    },
    
    buttonText: {
        fontSize: wp("7%"),
        textAlign: "center",
        color: colors.white,
    },

    linearGradient: {
        height: 'auto',
        width: wp("88%"),
        overflow: "hidden",
        alignSelf: "center",
        paddingTop: hp("1%"),
        borderRadius: wp("4%"),
        marginVertical: hp("2%"),
        paddingHorizontal: wp("5%"),
    },

    editBudgetContainer: {
        marginTop: hp("1.5%"),
    },

    editBudget: {},

    totalBudgetContainer: {
        position: "relative",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start", 
        minHeight: wp("40%"), 
    },

    totalBudget: {
        left: 0,
        zIndex: 1000,
        bottom: wp("2%"),
        position: "absolute",
    },

    totalBudgetText: {
        fontWeight: "600",
        color: colors.white,
        fontSize: wp("4.5%"),
    },

    totalBalanceText: {
        fontWeight: "600",
        fontSize: wp("10%"),
        color: colors.white,
    },

    budgetIllustration: {
        alignSelf: "flex-end",
        marginLeft: "auto",
    },

    budgetTrackingContainer: {
        height: 'auto',
        width: wp("88%"),
        alignSelf: "center",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("5%"),
    },

    budgetTracking: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    budgetBalanceText: {},

    remainingBalanceText: {
        fontSize: wp("5.5%"),
    },

    totalBudgetAmountText: {
        color: '#27ae60',
        fontSize: wp("5.5%"),
    },

    budgetContainer: {
        height: 'auto',
        width: wp("88%"),
        alignItems: "center",
        alignSelf: "center",
        borderRadius: wp("4%"),
        marginBottom: hp("1.5%"),
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
        backgroundColor: colors.white,
        elevation: 2,
        shadowOpacity: 0.1,
        shadowRadius: wp("0.4%"),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: hp("0.2%") },
    },

    remainingBalanceContainer: {
        gap: wp("38%"),
        flexDirection: "row",
        paddingBottom: hp("0.5%"),
        justifyContent: "space-between",
    },

    budgetTrackingBar: {
        width: '100%',
        height: hp("1.6%"),
        backgroundColor: '#F5F5F5',
        borderRadius: wp("10%"),
        overflow: 'hidden',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: hp("0.2%") },
        shadowOpacity: 0.1,
        shadowRadius: wp("0.4%"),
        elevation: 2,
        marginVertical: wp("1.5%"),
    },

    budgetTrackingBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: wp("1.2%"),
    //  backgroundImage: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
    },

    budgetTrackingDetails: {
        marginTop: hp("0.5%"),
    },

    expensesContainer: {
        justifyContent: "center",
        marginHorizontal: wp("5.5%"),
    },

    expensesHeader: {
        marginBottom: hp("1%"),
    },

    expensesHeaderTitle: {
        fontWeight: "600",
        fontSize: wp("4.5%"),  
        paddingLeft: wp("0.5%"),
    },

    expensesGridContainer: {
        padding: wp("2.5%"),
        borderRadius: wp("2.5%"),
        backgroundColor: colors.white,
        elevation: 2,
        shadowOpacity: 0.1,
        shadowRadius: wp("0.4%"),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: hp("0.2%") },
    },

    expensesGridItemDivider: {
        borderBottomWidth: 1,
        marginVertical: hp("1.5%"),  
        borderBottomColor: colors.border,
    },

    expensesGridHeader: {
        flexDirection: "row",
        paddingHorizontal: wp("2.5%"),
        justifyContent: "space-between",
    },

    expensesGridItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("2.5%"),
        justifyContent: "space-between",  
    },

    expenseCategoryText: {
    },

    editIcon: {
        width: wp("4.5%"),
        height: wp("4.5%"),
    },

    budgetRequiredText: {
        fontSize: wp("4%"),
    },
    
    noExpensesContainer: {},

    noExpensesText: {
        marginLeft: wp("2.5%"),
    },

    budgetStatusMessage: {},
    
    remainingText: {
        marginVertical: hp("0.5%"),
    },
})

export default Budget