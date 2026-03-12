import qrcode
from io import BytesIO
import base64

def generate_pickup_qr(item_id: str, user_id: str):
    # Create the secure data string [cite: 39]
    data = f"hero_pickup:{item_id}:{user_id}"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64 for easy frontend rendering [cite: 16]
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()