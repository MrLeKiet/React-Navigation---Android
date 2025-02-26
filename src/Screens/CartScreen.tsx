import { View, Text, Platform, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import DisplayMessage from '../Componenets/ProductDetails/DisplayMessage';
import { useSelector, useDispatch } from 'react-redux';
import { CartState, ProductListParams } from '../TypesCheck/productCartTypes';
import { removeFromCart } from '../redux/CartReducer'; // Nhập action để xóa sản phẩm

const CartScreen = ({ navigation, route }: TabsStackScreenProps<'Cart'>) => {
  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
      navigation.navigate("Home");
    }
  };

  const goToPreviousScreen = () => {
    if (navigation.canGoBack()) {
      console.log("Chuyển về trang trước.");
      navigation.goBack();
    } else {
      console.log("Không thể quay lại, chuyển về trang Home.");
      navigation.navigate("Home"); // Điều hướng fallback nếu không quay lại được
    }
  };

  const cart = useSelector((state: CartState) => state.cart.cart);
  const dispatch = useDispatch(); // Sử dụng dispatch để xóa sản phẩm
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  // Tính tổng giá trị
  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  // Render item trong FlatList
  const renderItem = ({ item }: { item: ProductListParams }) => (
    <View style={styles.cartItem}>
      <Image style={styles.productImage} source={{ uri: item.images[0] }} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        {item.oldPrice && (
          <Text style={styles.oldPrice}>${item.oldPrice.toFixed(2)}</Text>
        )}
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item._id)}
        hitSlop={10} // Tăng vùng nhấn cho nút
      >
        <Text style={styles.removeText}>X</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {displayMessage && (
        <DisplayMessage
          message={message}
          visible={() => setDisplayMessage(!displayMessage)}
        />
      )}

      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        cartLength={cart.length}
        goToPrevious={goToPreviousScreen}
      />

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống.</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Tổng giá trị và nút thanh toán */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Tổng: ${totalPrice.toFixed(2)}</Text>
            </View>
            <Pressable style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Thay nền đen bằng trắng
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 5,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
    maxWidth: '70%',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  removeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  totalContainer: {
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CartScreen;