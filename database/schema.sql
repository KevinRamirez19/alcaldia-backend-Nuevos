-- Crear tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('administrador', 'analitico', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de testimonios
CREATE TABLE testimonios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Políticas para testimonios
CREATE POLICY "Anyone can create testimonios" ON testimonios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view approved testimonios" ON testimonios
  FOR SELECT USING (estado = 'aprobado');

CREATE POLICY "Admins and analiticos can view all testimonios" ON testimonios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('administrador', 'analitico')
    )
  );

CREATE POLICY "Admins and analiticos can update testimonios" ON testimonios
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('administrador', 'analitico')
    )
  );

CREATE POLICY "Admins can delete testimonios" ON testimonios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
